const factory = require("./handlerFactory");
const User = require("../models/userModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const multer = require("multer");
const { v1: uuid } = require("uuid");
exports.getAllUsers = factory.getAll(User, [
  { path: "posts" },
  { path: "myPosts" },
  { path: "followers", model: "User" },
]);
exports.getOneUser = factory.getOne(User, [
  { path: "posts" },
  { path: "myPosts" },
  { path: "followers", model: "User" },
]);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);

const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${uuid()}-${Date.now()}.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image. Please upload only images", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");
exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndRemove(req.params.id);
  const data = await User.updateMany(
    {
      following: {
        $in: [req.params.id],
      },
    },
    {
      $pull: {
        following: req.params.id,
      },
    }
  );
  res.status(200).json({
    status: "success",
    data,
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for changing password. Please use another route",
        401
      )
    );
  }

  const updateFields = filteredObj(req.body, "name", "email");
  if (req.file) {
    updateFields.photo = req.file.filename;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.followUser = catchAsync(async (req, res, next) => {
  const userToFollow = await User.findById(req.params.id);
  if (!userToFollow)
    return next(
      new AppError("User you want to follow does not longer exist", 404)
    );
  if (userToFollow.followers.includes(req.user._id)) {
    return next(new AppError("You already follow this user", 403));
  }
  if (req.params.id === req.user._id) {
    return next(new AppError("You can't follow yourself", 403));
  }
  const updatedUserToFollow = await User.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        followers: req.user._id,
      },
    },
    {
      new: true,
      runValidators: false,
    }
  );
  const updatedUserWhoFollows = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        following: req.params.id,
      },
    },
    {
      new: true,
      runValidators: false,
    }
  );
  res.status(201).json({
    status: "success",
    data: {
      userOne: updatedUserToFollow,
      userTwo: updatedUserWhoFollows,
    },
  });
});
exports.unfollowUser = catchAsync(async (req, res, next) => {
  const userToUnfollow = await User.findById(req.params.id);
  if (!userToUnfollow)
    return next(
      new AppError("User you want to unfollow does not longer exist", 404)
    );
  if (!userToUnfollow.followers.includes(req.user._id)) {
    return next(new AppError("You can't unfollow user you don't follow", 403));
  }
  if (req.params.id === req.user._id) {
    return next(new AppError("You can't unfollow yourself", 403));
  }
  const updatedUserToUnfollow = await User.findByIdAndUpdate(
    req.params.id,
    {
      $pull: {
        followers: req.user._id,
      },
    },
    {
      new: true,
      runValidators: false,
    }
  );
  const updatedUserWhoUnfollows = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        following: req.params.id,
      },
    },
    {
      new: true,
      runValidators: false,
    }
  );
  res.status(201).json({
    status: "success",
    data: {
      userOne: updatedUserToUnfollow,
      userTwo: updatedUserWhoUnfollows,
    },
  });
});

exports.deleteUser = () => {
  return catchAsync(async (req, res, next) => {
    const peopleWhoFollow = await User.find({ following: req.params.id });
    console.log(peopleWhoFollow);
    const peopleWhoAreFollowed = await User.find({ followers: req.params.id });

    User.updateMany(
      { following: { $in: [req.params.id] } },
      {
        $pull: { following: req.params.id },
      },
      { multi: true }
    );

    if (peopleWhoAreFollowed) {
      User.updateMany(
        { followers: { $in: [req.params.id] } },
        {
          $pull: { followers: req.params.id },
        }
      );
    }
    await User.findByIdAndRemove(req.params.id);
    res.status(201).json({
      status: "success",
    });
  });
};
