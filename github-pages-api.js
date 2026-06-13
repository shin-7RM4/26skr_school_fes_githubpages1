/*
 * GitHub Pages など静的ホスティングから GAS API を呼び出すための共有ヘルパー。
 * 1) GAS Web アプリをデプロイし、実行 URL を GAS_API_BASE_URL に設定してください。
 * 2) GitHub Pages で公開する HTML から import して利用します。
 */

let GAS_API_BASE_URL = 'https://script.google.com/a/macros/sakura-h.ed.jp/s/AKfycbwRLkBx07y89wl1U_-OfWzAIrotvR_s_iqUEGxM0oC9SDu-7krHqa18qREz6zSzX2nJGQ/exec';

function assertApiBaseUrl() {
  if (!GAS_API_BASE_URL || GAS_API_BASE_URL.includes('REPLACE_WITH_YOUR_DEPLOY_ID')) {
    throw new Error('GAS_API_BASE_URL が正しく設定されていません。github-pages-api.js の先頭で URL を置き換えてください。');
  }
}

// NOTE: 一時的な回避策 — ブラウザのプリフライト(OPTIONS) を発生させない
// Content-Type を application/x-www-form-urlencoded にして送信します。
async function callGasApi(action, params = {}) {
  assertApiBaseUrl();

  const form = new URLSearchParams({ action, ...params });
  const response = await fetch(GAS_API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: form.toString()
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`GAS API error ${response.status}: ${response.statusText} ${text}`);
  }

  // レスポンスは JSON を期待
  return await response.json();
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
