const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
export const hashPassword = (password: string) => {
    return bcrypt.hashSync(password, salt);
}

export const comparePassword = async (plainPassword: string, hashedPassword: string) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
}
