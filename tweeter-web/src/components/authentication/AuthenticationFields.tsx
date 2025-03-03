import React from "react";

interface Props {
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  setAlias: (alias: string) => void;
  setPassword: (password: string) => void;
}

const AuthenticationFields: React.FC<Props> = (props: Props) => {
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          aria-label="alias"
          id="aliasInput"
          placeholder="name@example.com"
          onKeyDown={props.onKeyDown}
          onChange={(event) => props.setAlias(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          aria-label="password"
          placeholder="Password"
          onKeyDown={props.onKeyDown}
          onChange={(event) => props.setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthenticationFields;
