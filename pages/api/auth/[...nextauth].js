import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import bcrypt from "bcryptjs";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User.model.js";

export default NextAuth({
    callbacks: {
        async jwt(token, user, account, profile, isNewUser) {
            console.log("--JWT");
            if (user) {
                token.user = user._id;
                token.name = user.username;
            }
            console.log(token, user, account, profile, isNewUser);
            return token;
        },
        async session(session, user) {
            console.log("---SESSION");
            session.user.name = user.name;
            session.user.userID = user.user;
            console.log(session, user);
            return session;
        },
    },

    providers: [
        Providers.Credentials({
            name: "credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                await dbConnect();
                const theUser = await User.findOne({
                    username: credentials.username,
                });
                console.log("theUser", theUser);
                if (theUser) {
                    const doesPasswordMatch = bcrypt.compareSync(
                        credentials.password,
                        theUser.password
                    );
                    if (doesPasswordMatch) return theUser;
                    else return null;
                } else return null;
            },
        }),
    ],
});
