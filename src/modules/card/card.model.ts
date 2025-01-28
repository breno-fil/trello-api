export class Card {
    id?: number;
    name: string;
    list_id: number;
    position: number;
    due_date: string;
    created_at: string;
    description: string;
    
    constructor(
      name: string,
      list_id: number,
      position: number,
      due_date: string,
      created_at: string,
      description: string,
      id?: number,
    ) {
      this.id = id;
      this.name = name;
      this.list_id = list_id;
      this.position = position;
      this.due_date = due_date;
      this.created_at = created_at;
      this.description = description;
    }
  }
  