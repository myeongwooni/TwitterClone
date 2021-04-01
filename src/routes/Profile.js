import authService from "fbase";
import React from "react";

export default () => {
    const onLogoutClick = () => authService.signOut();

    return (
        <>
        <button onClick={onLogoutClick}>Log Out</button>
        </>
    )
};