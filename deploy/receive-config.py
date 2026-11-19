#!/usr/bin/python3
"""Receive secrets on stdin. Never execute or log configuration values."""
import json,os,re,secrets
from pathlib import Path
payload=json.load(__import__('sys').stdin)
if set(payload)!={'registryUser','registryToken','settings'}:raise ValueError('Invalid payload')
if not re.fullmatch(r'[A-Za-z0-9_\[\]-]+',payload['registryUser']):raise ValueError('Invalid registry user')
allowed={'POSTGRES_PASSWORD','OPERATIONS_TOKEN','RESEND_API_KEY','OPENAI_API_KEY','WISEN_ADMIN_EMAIL','WISEN_ADMIN_PASSWORD','AI_MODEL','AI_MONTHLY_LIMIT_BRL','AI_INPUT_USD_PER_MILLION','AI_OUTPUT_USD_PER_MILLION','AI_USD_BRL','AI_COST_MARGIN','AI_DAILY_USER_LIMIT','AI_MAX_OUTPUT_TOKENS','COLLECTION_DAILY_LIMIT','COLLECTION_INTERVAL_MINUTES','EMAIL_DAILY_LIMIT'}
s=payload['settings']
if set(s)-allowed:raise ValueError('Unexpected settings')
for k in ['POSTGRES_PASSWORD','OPERATIONS_TOKEN','RESEND_API_KEY','WISEN_ADMIN_EMAIL','WISEN_ADMIN_PASSWORD']:
 if not isinstance(s.get(k),str) or not s[k]:raise ValueError('Missing required setting: '+k)
if len(s['OPERATIONS_TOKEN'])<32 or not re.fullmatch(r'[A-Za-z0-9_-]{32,}',s['POSTGRES_PASSWORD']):raise ValueError('Invalid production credentials')
config=Path('/opt/wisen/.env.production')
if config.exists():
 old=dict(line.split('=',1) for line in config.read_text().splitlines() if '=' in line)
 for k in ['POSTGRES_PASSWORD','OPERATIONS_TOKEN']:
  if k in old and json.loads(old[k])!=s[k]:raise ValueError('Credential rotation requires a separate migration: '+k)
s.update(NODE_ENV='production',DATABASE_URL='postgres://wisen:'+s['POSTGRES_PASSWORD']+'@database:5432/wisen',POSTGRES_USER='wisen',POSTGRES_DB='wisen',FRONTEND_URL='https://gowisen.app',PUBLIC_DOMAIN='gowisen.app',PORT='8080',MODEL_CACHE_DIR='/models',TRUST_PROXY='172.30.70.10',AI_PROVIDER='openai',EMAIL_FROM='Wisen <nao-responda@gowisen.app>')
for k,v in s.items():
 if not isinstance(v,str) or any(c in v for c in '\r\n\x00'):raise ValueError('Invalid configuration field')
tmp=config.with_name('.env.next-'+secrets.token_hex(8))
fd=os.open(tmp,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
with os.fdopen(fd,'w') as f:
 for k,v in s.items():f.write(k+'='+json.dumps(v,ensure_ascii=False)+'\n')
os.replace(tmp,config)
registry=Path(os.environ['DOCKER_CONFIG'])
import base64
(registry/'config.json').write_text(json.dumps({'auths':{'ghcr.io':{'auth':base64.b64encode((payload['registryUser']+':'+payload['registryToken']).encode()).decode()}}}))
os.chmod(registry/'config.json',0o600)
