import re

with open('src/store/SettingsContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

settings_interface = """interface Settings {
  projectName: string;
  companyName: string;
  logoUrl: string;
  smsEnabled?: boolean;
  smsApiKey?: string;
  smsLineNumber?: string;
  smsNotifyRequester?: boolean;
  smsNotifySupervisor?: boolean;
  smsNotifyStorekeeper?: boolean;
  smsNotifyPurchaser?: boolean;
}"""

content = re.sub(r"interface Settings \{[^\}]+\}", settings_interface, content)

with open('src/store/SettingsContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
