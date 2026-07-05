import re

with open('server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

settings_old = """let SETTINGS = {
  projectName: 'سامانه درخواست کالا',
  companyName: 'شرکت فولاد صنعت',
  logoUrl: ''
};"""

settings_new = """let SETTINGS = {
  projectName: 'سامانه درخواست کالا',
  companyName: 'شرکت فولاد صنعت',
  logoUrl: '',
  smsEnabled: false,
  smsApiKey: '',
  smsLineNumber: '300000000000',
  smsNotifyRequester: true,
  smsNotifySupervisor: true,
  smsNotifyStorekeeper: true,
  smsNotifyPurchaser: true
};"""

content = content.replace(settings_old, settings_new)

sms_old = """async function sendSms(mobiles: string[], messageText: string) {
  if (!mobiles || mobiles.length === 0) return;
  const validMobiles = mobiles.filter(m => m && m.trim().length >= 10);
  if (validMobiles.length === 0) return;

  try {
    const response = await fetch('https://api.sms.ir/v1/send/bulk', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SMS_API_KEY || 'LzBMfwWGgOz0ugQHHejPsWFMvWkEaZkyEdsZv6C8TpsoKy1x',
        'Content-Type': 'application/json',
        'ACCEPT': 'application/json'
      },
      body: JSON.stringify({
        lineNumber: Number(process.env.SMS_LINE_NUMBER || 300000000000),
        messageText,
        mobiles: validMobiles,
        sendDateTime: null
      })
    });
    const data = await response.json();
    console.log('SMS sent:', data);
  } catch (err) {
    console.error('Error sending SMS:', err);
  }
}"""

sms_new = """async function sendSms(mobiles: string[], messageText: string, targetRole: 'requester' | 'supervisor' | 'storekeeper' | 'purchaser' = 'requester') {
  if (!SETTINGS.smsEnabled || !SETTINGS.smsApiKey) return;
  
  if (targetRole === 'requester' && !SETTINGS.smsNotifyRequester) return;
  if (targetRole === 'supervisor' && !SETTINGS.smsNotifySupervisor) return;
  if (targetRole === 'storekeeper' && !SETTINGS.smsNotifyStorekeeper) return;
  if (targetRole === 'purchaser' && !SETTINGS.smsNotifyPurchaser) return;

  if (!mobiles || mobiles.length === 0) return;
  const validMobiles = mobiles.filter(m => m && m.trim().length >= 10);
  if (validMobiles.length === 0) return;

  try {
    const response = await fetch('https://api.sms.ir/v1/send/bulk', {
      method: 'POST',
      headers: {
        'X-API-KEY': SETTINGS.smsApiKey,
        'Content-Type': 'application/json',
        'ACCEPT': 'application/json'
      },
      body: JSON.stringify({
        lineNumber: Number(SETTINGS.smsLineNumber || 300000000000),
        messageText,
        mobiles: validMobiles,
        sendDateTime: null
      })
    });
    const data = await response.json();
    console.log('SMS sent:', data);
  } catch (err) {
    console.error('Error sending SMS:', err);
  }
}"""

content = content.replace(sms_old, sms_new)

with open('server.ts', 'w', encoding='utf-8') as f:
    f.write(content)
