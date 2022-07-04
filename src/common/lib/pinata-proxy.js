import Kilt from "@kiltprotocol/sdk-js"
import axios from "axios"
import store from "@/store"
import {
  getIpfsMetaData as pinataIpfsGetIpfsMetadata,
  uploadFile as pinataIpfsUploadFile,
  downloadJson
} from "@debionetwork/pinata-ipfs"

const pinataJwtKey = process.env.VUE_APP_PINATA_JWT_KEY

export const uploadFile = val => {
  const options = {
    pinataMetadata: {
      name: val.title,
      keyvalues: {
        required: process.env.VUE_APP_PINATA_REQUIRED_DOCUMENT,
        type: val.type,
        fileSize: val.size,
        date: +new Date()
      }
    },
    pinataOptions: { cidVersion: 0 }
  }

  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  store.dispatch("geneticData/setCancel", {
    source
  })

  return pinataIpfsUploadFile(
    options,
    val.file,
    pinataJwtKey,
    source.token,
    (progressEvent) => {
      if (!progressEvent.lengthComputable) return

      let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
      store.dispatch("geneticData/getLoadingProgress", { upload: percentCompleted || 0 })
    }
  )
}

export const getFileUrl = cid => {
  return `${process.env.VUE_APP_PINATA_GATEWAY}/${cid}`
}

export const downloadFile = async (ipfsLink, withMetaData = false) => {
  console.log("Downloading...")
  const result = await downloadJson(
    ipfsLink,
    withMetaData,
    pinataJwtKey
  )
  console.log("Success Downloaded!")

  return result
}

export const getIpfsMetaData = async (cid) => {
  return await pinataIpfsGetIpfsMetadata(
    cid,
    pinataJwtKey
  )
}

export const decryptFile = (obj, pair) => {
  const box = Object.values(obj[0].data.box)
  const nonce = Object.values(obj[0].data.nonce)
  let decryptedFile

  const toDecrypt = {
    box: Uint8Array.from(box),
    nonce: Uint8Array.from(nonce)
  }

  decryptedFile = Kilt.Utils.Crypto.decryptAsymmetric(toDecrypt, pair.publicKey, pair.secretKey)

  if (!decryptedFile) console.log("Undefined File", decryptedFile)
  else return decryptedFile
}

export const downloadDocumentFile = (data, fileName, type) => {
  try {
    const blob = new Blob([data], { type });
    const a = document.createElement("a");

    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
    a.click()
  } catch (error) {
    console.error(error)
  }
}

export const downloadWithProgress = async (ipfsLink, withMetaData = false) => {
  const cid = ipfsLink.split("/").pop();
  const response = await fetch(new URL(ipfsLink).toString());
  const contentLength = response.headers.get("content-length");
  const total = parseInt(contentLength, 10);
  let loaded = 0;

  const res = new Response(new ReadableStream({
    async start(controller) {
      const reader = response.body.getReader();
      do {
        const { value } = await reader.read();
        loaded += value.byteLength;
        let percentCompleted = Math.round( (loaded * 100) / total )
        store.dispatch("geneticData/getLoadingProgress", { download: percentCompleted || 0 } )
        controller.enqueue(value);
      } while (loaded < total)
      controller.close();
    }
  }))

  const data = await res.json()
  let metadata;

  if (withMetaData) {
    if (pinataJwtKey == null) {
      throw new Error("pinataJwtKey parameter is required if withMetaData is set to true");
    }

    const { rows } = await pinataIpfsGetIpfsMetadata(cid, pinataJwtKey);

    metadata = {
      name: rows[0].metadata.name,
      type: rows[0].metadata.keyvalues.type
    };
  }

  return { ...(withMetaData ? metadata : null), data };
}
