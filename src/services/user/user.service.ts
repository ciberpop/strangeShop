import {UserModel} from '../../database';
import {IUser, IUserToken} from '../../models';
import {Types} from 'mongoose';
import {ActionEnum} from '../../constants';

class UserService {
  createUser(user: Partial<IUser>): Promise<IUser> {
    const userToCreate = new UserModel(user);

    return userToCreate.save();
  }

  addActionToken(userId: string, tokenObject: IUserToken): Promise<IUser> {
    return UserModel.update(
      {_id: Types.ObjectId(userId)},
      {
        $push: {
          tokens: tokenObject
        }
      }
    ) as any;
  }

  updateUserByParams(params: Partial<IUser>, update: Partial<IUser>): Promise<IUser | null> {
    return UserModel.updateOne(params, update, {new: true}) as any;
  }

  findOneByParams(params: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findOne(params) as any;
  }

  findUserByActionToken(action: ActionEnum, token: string): Promise<IUser | null> {
    return UserModel.findOne({
      $and: [
        {'tokens.action': action},
        {'tokens.token': token}
      ]
    }) as any;
  }

  // removeActionToken(action: ActionEnum, token: string): Promise<IUser | null> {
  //   return UserModel.update(
  //     {},
  //     {
  //       $pull: {
  //         $and: [
  //           {'tokens.action': action},
  //           {'tokens.token': token}
  //         ]
  //       } as any
  //     }
  //   ) as any;
  // }
}

export const userService = new UserService();
