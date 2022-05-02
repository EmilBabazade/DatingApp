import { User } from './user';

export class UserParams {
  gender: string;
  minAge = 18;
  maxAge = 99;
  pageNumber = 1;
  pageSize = 5;
  orderBy = 'lastActive';

  /**
   * eat shit
   */
  constructor(user: User) {
    switch(user.gender) {
    case 'female':
      this.gender = 'male';
      break;
    case 'male':
      this.gender = 'female';
      break;
    default:
      this.gender = 'other';
    }
  }
}
