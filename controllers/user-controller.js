const { User, Thought } = require('../models');

const userController = {
  // get all users
  async getUsers(req, res) {
    try {
      const UserData = await User.find()
        .select('-__v')

      res.json(UserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // get single user by id
  async getSingleUser(req, res) {
    try {
      const UserData = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts');

      if (!UserData) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }

      res.json(UserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const UserData = await User.create(req.body);
      res.json(UserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // update a single user by id
  async updateUser(req, res) {
    try {
      const UserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        {
          $set: req.body,
        },
        {
          runValidators: true,
          new: true,
        }
      );

      if (!UserData) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }

      res.json(UserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // delete user and delete their thoughts
  async deleteUser(req, res) {
    try {
      const UserData = await User.findOneAndDelete({ _id: req.params.userId })

      if (!UserData) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }

      //get ids of user's `thoughts` and delete them all
      await Thought.deleteMany({ _id: { $in: UserData.thoughts } });
      res.json({ message: 'User and their thoughts deleted!' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // add friend to friend list
  async addFriend(req, res) {
    try {
      const UserData = await User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true });

      if (!UserData) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }

      res.json(UserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // remove friend from friend list
  async removeFriend(req, res) {
    try {
      const UserData = await User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true });

      if (!UserData) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }

      res.json(UserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
