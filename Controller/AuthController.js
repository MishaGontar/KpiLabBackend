import jwt from "jsonwebtoken";
import UserService from "../Service/UserService.js";
import AuthService from "../Service/AuthService.js";

class AuthController {
    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)
        try {
            req.user = jwt.verify(token, process.env.TOKEN_SECRET)
            console.log("Correct user", req.user)
            next()
        } catch (e) {
            console.log(e)
            return res.sendStatus(403)
        }
    }

    async signup(req, res) {
        try {
            const {username, password} = req.body
            if (!password || !username) return res.status(400).json("Введіть будь ласка коректні дані")

            const user = await UserService.getUser({username: username, password: password})
            if (user === null || !user) return res.status(400).json("Введіть будь ласка коректні дані")
            console.log("Find ", user)
            return res.status(200).json({token: AuthService.generateAccessToken({username: username})})
        } catch (e) {
            console.log(e)
            return res.status(500).json("Щось пішло не так , вибачте за незручності ")
        }
    }
}

export default new AuthController();