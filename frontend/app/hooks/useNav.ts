import { Dispatch, SetStateAction, useState } from "react";

export enum Navigation {
    balance,
    codes
}
export function useNav(): [Navigation, Dispatch<SetStateAction<Navigation>>] {
    const [nav, setNav] = useState<Navigation>(Navigation.balance);
    return [ nav, setNav ];
}