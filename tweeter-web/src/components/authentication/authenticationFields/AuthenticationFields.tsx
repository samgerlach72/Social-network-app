interface Props {
    aliasfn: (event: React.ChangeEvent<HTMLInputElement>) => void;
    passwordfn: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthenticationFields = (props: Props) => {
    return(
        <>
            <div className="form-floating">
                <input
                type="text"
                className="form-control"
                size={50}
                id="aliasInput"
                aria-label="alias"
                placeholder="name@example.com"
                onChange={(event) => props.aliasfn(event)}
                />
                <label htmlFor="aliasInput">Alias</label>
            </div>
            <div className="form-floating">
                <input
                type="password"
                className="form-control"
                id="passwordInput"
                aria-label="password"
                placeholder="Password"
                onChange={(event) => props.passwordfn(event)}
                />
                <label htmlFor="passwordInput">Password</label>
            </div>
        </>
    );
}

export default AuthenticationFields;