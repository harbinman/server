import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const userRegister = async (req, res) => {
  try {
    const { username, password } = req.body;

    const checkUser = await User.findOne({ username });

    if (checkUser)
      return res.status(400).json({
        message: "username already used",
      });

    const user = new User({ username });

    user.setPassword(password);

    await user.save();

    res.status(201).json({});
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const userSignIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select(
      "username password salt id class"
    );

    if (!user)
      return res.status(400).json({
        message: "User not found",
      });

    if (!user.validPassword(password))
      return res.status(400).json({
        message: "Wrong password",
      });

    const token = jwt.sign({ data: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "24H",
    });
    console.log(user);
    res.status(200).json({
      token,
      username,
      id: user._id,
      class: user.class,
    });
  } catch (err) {}
};
export const userBuy = async (req, res) => {
  const { price, title, userName } = req.body;
  console.log(req.body);
  console.log(price, title[0], userName);
  const classLevel = title[0];
  try {
    // if (!Number.isInteger(classLevel)) {
    //   res.status(404).json({ message: "商品名称错误！" });
    // }
    const result = await setClassLevel(userName, classLevel);
    console.log("result:", result);
    if (!result) {
      res.status(404).json({ message: "User not found" });
    } else {
      res
        .status(200)
        .json({ message: "充值成功！", class: result.class, success: true });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const setClassLevel = async (userName, classLevel) => {
  let updateFields = { class: classLevel };
  console.log(classLevel);

  const currentDate = new Date();
  const newexpirationDate = new Date(currentDate);
  if (classLevel == 1) {
    newexpirationDate.setDate(currentDate.getDate() + 30); // 增加 30 天
    console.log("newexpirationDate", newexpirationDate);
  }
  updateFields.expirationDate = newexpirationDate;

  const updatedUser = await User.findOneAndUpdate(
    { username: userName },
    updateFields,
    { new: true } // 返回更新后的记录，并指定返回的字段
  );
  return updatedUser;
};
