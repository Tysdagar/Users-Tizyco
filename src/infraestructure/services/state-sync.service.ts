import { Injectable } from '@nestjs/common';
import { IStateDAOSync } from 'src/domain/common/interfaces/state-sync.interface';
import { GlobalVariablesClient } from 'src/infraestructure/configuration/clients/global-variables.client';

/**
 * Service for synchronizing enumeration tables with supported values.
 */
@Injectable()
export class StateSyncService {
  /**
   * Data Access Object (DAO) used for synchronizing enum tables.
   */
  private enumDAOSync: IStateDAOSync;

  /**
   * Sets the DAO responsible for syncing the state.
   *
   * @param enumDAOSync - The DAO to handle state synchronization.
   */
  setEnumDAO(enumDAOSync: IStateDAOSync): void {
    this.enumDAOSync = enumDAOSync;
  }

  /**
   * Synchronizes enum tables by comparing supported values with existing values
   * in the database and updating the database with missing values.
   *
   * @param supportedValues - A list of supported enum values.
   * @returns A promise that resolves when the synchronization is complete.
   */
  async syncEnumTables(supportedValues: string[]): Promise<void> {
    // Fetch all existing enum values from the database.
    const existingValues = await this.enumDAOSync.findAll();

    // Create a map of existing values for quick lookup.
    const existingValuesMap = new Map(
      existingValues.map((s) => [s.value, s.id]),
    );

    // Determine which supported values are missing in the database.
    const missingValues = supportedValues.filter(
      (value) => !existingValuesMap.has(value),
    );

    // Save the missing values to the database.
    if (missingValues.length) {
      await this.enumDAOSync.saveRange(missingValues);

      // Refresh the list of values after saving the missing ones.
      const updatedValues = await this.enumDAOSync.findAll();
      updatedValues.forEach((s) => existingValuesMap.set(s.value, s.id));
    }

    // Save the updated values to global variables.
    GlobalVariablesClient.saveVariables(existingValuesMap);
  }
}
