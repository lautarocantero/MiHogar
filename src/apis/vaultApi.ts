export function vaultExists(): Promise<boolean> {
  return window.vaultApi.exists()
}

export function createVaultFile(householdKey: string): Promise<unknown> {
  return window.vaultApi.create(householdKey)
}

export function unlockVaultFile(householdKey: string): Promise<unknown> {
  return window.vaultApi.unlock(householdKey)
}

export function lockVaultFile(): Promise<void> {
  return window.vaultApi.lock()
}

export function verifyHouseholdKey(candidateKey: string): Promise<boolean> {
  return window.vaultApi.verifyKey(candidateKey)
}

export function saveVaultFile(vaultJson: unknown): Promise<void> {
  return window.vaultApi.save(vaultJson)
}

export function changeHouseholdKey(currentKey: string, newKey: string): Promise<void> {
  return window.vaultApi.changeKey(currentKey, newKey)
}

export function exportVaultBackup(): Promise<string | null> {
  return window.vaultApi.exportBackup()
}

export function importVaultBackup(): Promise<boolean> {
  return window.vaultApi.importBackup()
}
