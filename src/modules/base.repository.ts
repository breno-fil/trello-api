export interface IRepository {
  /**
   * Find all entities
   */
  findAll(filter: any): Promise<any[]>;
  /**
   * Count all entities
   */
  count(filter: any): Promise<any>;
  /**
   * Find entity by its id.
   * @param id entity identifier
   */
  findById(id: string): Promise<any>;
  /**
   * Creates an entity
   * @param entity entity to be created
   */
  create(entity: any): Promise<any>;
  /**
   * Updates an entity
   * @param entity entity to be updated
   */
  update(entity: any): Promise<any>;
  /**
   * Deletes an entity
   * @param id entity identifier
   */
  delete(id: string): Promise<any>;
}