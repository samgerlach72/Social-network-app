import { UserService } from "../model/model/UserService";
import { Buffer } from "buffer";
import { Presenter } from "./Presenter";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView{ 
    setImageBytes: React.Dispatch<React.SetStateAction<Uint8Array>>,
    setImageUrl: React.Dispatch<React.SetStateAction<string>>
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  private service: UserService;

  public constructor(view: RegisterView){
      super(view);
      this.service = new UserService();
  }

  public checkSubmitButtonStatus(firstName: string, lastName: string, alias: string, password: string, imageUrl: string): boolean {
      return !firstName || !lastName || !alias || !password || !imageUrl;
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
  
  public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, rememberMeRef: React.MutableRefObject<boolean>) {
    this.doFailureReportingOperation(async() => {
      await this.doAuthenticationOperation(alias, password, rememberMeRef, undefined, firstName, lastName, imageBytes);
    }, "register user");  
  };

  protected async callService(alias: string, password: string, firstName: string, lastName: string, imageBytes: Uint8Array){
    return await this.service.register(firstName, lastName, alias, password, imageBytes);
  }
}