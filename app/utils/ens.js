import { Ens } from '@ensdomains/ensjs';
import { getDefaultProvider } from 'ethers';

const ens = new Ens({ provider: getDefaultProvider('mainnet') });
export async function getAvatar(name) {
  try { return await ens.name(name).getText('avatar'); }
  catch { return null; }
}
