import { ENS } from '@ensdomains/ensjs';

export async function getAvatar(ensName) {
  const provider = new JsonRpcProvider("https://mainnet.base.org");
  const ens = new ENS({ provider, ensAddress: '0xD2fc7fcab8F8f9f7f5fF1CB15da1C3a1f041CD64' }); // Base ENS
  const profile = await ens.getProfile(ensName);
  return profile?.records?.avatar?.value || null;
}
