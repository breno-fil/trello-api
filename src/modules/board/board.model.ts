export class Board {
    id?: number;
    name: string;
    background_color: string;
    text_color: string;
    created_by: number;
    
    constructor(
      name: string,
      background_color: string,
      text_color: string,
      created_by: number,
      id?: number,
    ) {
      this.id = id;
      this.name = name;
      this.text_color = text_color;
      this.background_color = background_color;
      this.created_by = created_by;
    }
  }
  