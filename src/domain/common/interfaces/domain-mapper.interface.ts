/**
 * Abstract class representing a Domain Mapper.
 * Provides a method to map Data Transfer Objects (DTOs) to domain entities.
 */
export abstract class IDomainMapper {
  /**
   * Maps a Data Transfer Object (DTO) to a corresponding domain entity.
   * This method should be implemented by subclasses to provide the specific mapping logic.
   *
   * @typeParam DTO - The type of the Data Transfer Object.
   * @typeParam DomainEntity - The type of the domain entity.
   * @param DTOentity - The DTO instance to be converted into a domain entity.
   * @returns The mapped domain entity.
   *
   * @throws Error - If the method is not implemented in the subclass.
   *
   * @example
   * ```typescript
   * class UserMapper extends IDomainMapper {
   *   static toDomain(userDTO: UserDTO): User {
   *     return new User(userDTO.id, userDTO.name);
   *   }
   * }
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static toDomain<DTO, DomainEntity>(DTOentity: DTO): DomainEntity {
    throw new Error('Method not implemented.');
  }
}
