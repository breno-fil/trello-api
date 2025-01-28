export class List {
    id?: number;
    name: string;
    board_id: string;
    position: number;
    
    constructor(
      name: string,
      board_id: string,
      position: number,
      id?: number
    ) {
      this.id = id;
      this.name = name;
      this.board_id= board_id;
      this.position = position;
    }
  }
  