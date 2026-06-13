/*
 * GitHub Pages など静的ホスティングから GAS API を呼び出すための共有ヘルパー。
 * 1) GAS Web アプリをデプロイし、実行 URL を GAS_API_BASE_URL に設定してください。
 * 2) GitHub Pages で公開する HTML から import して利用します。
 */

let GAS_API_BASE_URL = 'https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOY_ID/exec';

function assertApiBaseUrl() {
  if (!GAS_API_BASE_URL || GAS_API_BASE_URL.includes('REPLACE_WITH_YOUR_DEPLOY_ID')) {
    throw new Error('GAS_API_BASE_URL が正しく設定されていません。github-pages-api.js の先頭で URL を置き換えてください。');
  }
}

async function callGasApi(action, params = {}) {
  assertApiBaseUrl();

  const payload = { action, ...params };
  const response = await fetch(GAS_API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`GAS API error ${response.status}: ${response.statusText} ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`GAS API のレスポンスが JSON ではありません: ${error.message}`);
  }
}

export async function getProgramList() {
  return await callGasApi('getProgramList');
}

export async function processQrCode(qrCodeText, selectedProgramCompositeKey) {
  return await callGasApi('processQrCode', {
    qrCodeText,
    selectedProgramCompositeKey
  });
}

export async function writeEntryTime(qrCodeText) {
  return await callGasApi('writeEntryTime', {
    qrCodeText
  });
}

export function setGasApiBaseUrl(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('GAS API base URL is required');
  }
  GAS_API_BASE_URL = url;
}

export function getGasApiBaseUrl() {
  return GAS_API_BASE_URL;
}
