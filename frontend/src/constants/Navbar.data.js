export const NAVBAR_CONST =  {
    "TITLE" : "CashFlow",
    "HOME" : "Home",
    "REGISTER" : "Register"

}

export const NAV_LINKS = [
  { to: "/", label: "Home", protected: false },
  { to: "/transact", label: "Transact", protected: true },
  { to: "/deposit", label: "Deposit", protected: true },
];