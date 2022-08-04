# manager

upgradeManager.ts

upgrades.admin.changeProxyAdmin
upgrades.admin.transferProxyAdminOwnership
upgrades.prepareUpgrades

typeManager.d.ts

interface EIPstandardMetadata { }
interface OpenseaStandardMetadata { }

# hooks

useFixture
// faster but overriding might occur

useSnapshot
await takeSnapshot.restore() // should be called each fixture for cleaner blockchain state

useABIgetter(simple, full): await hre.getArtifacts // simple contract JSON or full json
