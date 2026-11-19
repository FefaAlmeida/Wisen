"""Build stdin payload without placing secrets on process arguments."""
import json,os,sys
required=['WISEN_POSTGRES_PASSWORD','WISEN_OPERATIONS_TOKEN','RESEND_API_KEY','WISEN_ADMIN_EMAIL','WISEN_ADMIN_PASSWORD']
for k in required:
 if not os.environ.get(k):raise SystemExit('Missing GitHub secret: '+k)
settings={
 'POSTGRES_PASSWORD':os.environ['WISEN_POSTGRES_PASSWORD'],
 'OPERATIONS_TOKEN':os.environ['WISEN_OPERATIONS_TOKEN'],
 'RESEND_API_KEY':os.environ['RESEND_API_KEY'],
 'WISEN_ADMIN_EMAIL':os.environ['WISEN_ADMIN_EMAIL'],
 'WISEN_ADMIN_PASSWORD':os.environ['WISEN_ADMIN_PASSWORD'],
 'OPENAI_API_KEY':os.environ.get('OPENAI_API_KEY',''),
}
for key in ['AI_MODEL','AI_MONTHLY_LIMIT_BRL','AI_INPUT_USD_PER_MILLION','AI_OUTPUT_USD_PER_MILLION','AI_USD_BRL','AI_COST_MARGIN','AI_DAILY_USER_LIMIT','AI_MAX_OUTPUT_TOKENS','COLLECTION_DAILY_LIMIT','COLLECTION_INTERVAL_MINUTES','EMAIL_DAILY_LIMIT']:
 if os.environ.get(key):settings[key]=os.environ[key]
json.dump({'registryUser':os.environ['REGISTRY_USER'],'registryToken':os.environ['REGISTRY_TOKEN'],'settings':settings},sys.stdout)
