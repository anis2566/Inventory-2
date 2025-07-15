import { ROLE } from "@/constant"

export { }

declare global {
    interface CustomJwtSessionClaims {
        role: ROLE
        isNewUser: boolean
    }
}
