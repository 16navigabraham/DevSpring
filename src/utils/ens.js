import { getDefaultProvider } from "ethers";
import { Ens } from "@ensdomains/ensjs";

const provider = getDefaultProvider("mainnet");
const ens = new Ens({ provider, ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" });

export const getAvatar = async (ensName) => {
  try {
    const record = await ens.name(ensName).getText("avatar");
    return record || null;
  } catch {
    return null;
  }
};