import { EBoardUser } from "./board-user.enum";

export class BoardUser {
    board_id?: number;
    user_id: number;
    role: EBoardUser;
    starred: boolean;
    
    constructor(
      board_id: number,
      user_id: number,
      role: EBoardUser,
      starred: boolean
    ) {
      this.role = role;
      this.user_id = user_id;
      this.starred = starred;
      this.board_id = board_id;
    }
  }
  