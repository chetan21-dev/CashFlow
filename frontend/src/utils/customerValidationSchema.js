
import { z } from 'zod'

export const customerValidationSchema = z.object({
    first_name : z.string()
    .min(1, "First name is required")
    .min(2, "First name should be more than 2 characters")
    .regex(/^[a-zA-Z]+$/, "Only characters are allowed"),
    middle_name : z.string()
    .min(1, "Middle name is required")
    .min(2, "Middle name should be more than 2 characters")
    .regex(/^[a-zA-Z]+$/, "Only characters are allowed"),
    last_name : z.string()
    .min(1, "Last name is required")
    .min(2, "First name should be more than 2 characters")
    .regex(/^[a-zA-Z]+$/, "Only characters are allowed"),
    gender : z.string(),
    email : z.string()
    .min(1, "Email is required")
    .max(30, "Email should be less than 30 characters")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email"),
    mobile : z.string()
    .min(1, "Mobile number is required")
    .max(10, "Mobile number should be only 10 characters")
    .regex(/^[6789]{1}[0-9]{9}$/,"Please Enter valid mobile number"),
    pan_number : z.string()
    .min(1, "PAN number is required")
    .min(10, "PAN number should be 10 characters")
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter valid PAN number") //ABCDE1234F
    .max(10, "PAN number should be 10 characters only"),
    aadhaar_number : z.string()
    .min(1, "Aadhaar number is required")
    .regex(/^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/, "Please enter valid Adhaar number"),
    password : z.string()
    .min(1, "Password is required")
})

export const customerLoginSchema = z.object({
    email : z.string()
    .min(1, "Email is required")
    .max(30, "Email should be less than 30 characters")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email"),
    password : z.string()
    .min(1, "Password is required")
})

export const depositBalanceSchma = z.object({
    account_number : z.string()
    .min(1, "Account number is required")
    .max(5, "Account number should be only 5 digits"),
    balance : z.string()
    .min(1, "Amount is required")
    .regex(/^(?:[1-9]\d{2,}|\d{4,})$/, "Amount should be atleast 100"),
})