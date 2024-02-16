import { ChangeEvent } from "react";
import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";
import { To, NavigateOptions } from "react-router-dom";

export interface RegisterView {
    displayErrorMessage: (message: string) => void;
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void, 
    navigate: (to: To, options?: NavigateOptions | undefined) => void,
    setImageBytes: React.Dispatch<React.SetStateAction<Uint8Array>>,
    setImageUrl: React.Dispatch<React.SetStateAction<string>>

}

export class RegisterPresenter{
    private view: RegisterView;
    private service: UserService;
    // public firstName: string = "these";
    // public lastName: string = "are";
    // public alias: string = "test";
    // public password: string = "strings";
    // public rememberMe: boolean = false;
    // public imageUrl: string = "";
    // public imageBytes: Uint8Array = new Uint8Array();
    // // public set firstName(value: string) {
    // //     this._firstName = value;
    // // }
    // // public set lastName(value: string) {
    // //     this._lastName = value;
    // // }
    // // public set alias(value: string) {
    // //     this._alias = value;
    // // }
    // // public set password(value: string) {
    // //     this._password = value;
    // // }
    // public setRememberMe(value: boolean): void {
    //     this.rememberMe = value;
    // }
    // // public get imageUrl(): string {
    // //     return this._imageUrl;
    // // }
    // // public set imageUrl(value: string){
    // //     this._imageUrl = value;
    // // }

    public constructor(view: RegisterView){
        this.view = view;
        this.service = new UserService();
    }

    public checkSubmitButtonStatus(firstName: string, lastName: string, alias: string, password: string, imageUrl: string): boolean {
        console.log("first");
        return !firstName || !lastName || !alias || !password || !imageUrl;
    };

    public handleFileChange(event: ChangeEvent<HTMLInputElement>, imageUrl: string, imageBytes: Uint8Array){
        const file = event.target.files?.[0];
        this.handleImageFile(file, imageUrl, imageBytes);
    };
    
    public handleImageFile(file: File | undefined, imageUrl: string, imageBytes: Uint8Array) {
        if (file) {
            this.view.setImageUrl(URL.createObjectURL(file));
      
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
              const imageStringBase64 = event.target?.result as string;
      
              // Remove unnecessary file metadata from the start of the string.
              const imageStringBase64BufferContents =
                imageStringBase64.split("base64,")[1];
      
              const bytes: Uint8Array = Buffer.from(
                imageStringBase64BufferContents,
                "base64"
              );
      
              this.view.setImageBytes(bytes);
            };
            reader.readAsDataURL(file);
          } else {
            this.view.setImageUrl("");
            this.view.setImageBytes(new Uint8Array());
          }
    };
    
    public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageUrl: string, imageBytes: Uint8Array, rememberMeRef: React.MutableRefObject<boolean>) {
        try {
            let [user, authToken] = await this.service.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes
            );

            this.view.updateUserInfo(user, user, authToken, rememberMeRef.current);
            this.view.navigate("/");
            } catch (error) {
            this.view.displayErrorMessage(
                `Failed to register user because of exception: ${error}`
            );
        }
    };
}