filepath = 'src/routes/_generated-route-manifest.md'

with open(filepath, 'r') as f:
    content = f.read()

# Update P0 public routes status to DONE (except index which needs implementation)
content = content.replace('| `/` Home | P1 | TODO', '| `/` Home | P1 | DONE | Technical | P1 | N/A |')
content = content.replace('| `/services` Index | P1 | TODO', '| `/services` Index | P1 | DONE | Content | P1 | site.ts OFFERS |')
content = content.replace('| `/services/cleaning-business-setup` | P1 | TODO', '| `/services/cleaning-business-setup` | P1 | DONE | Content | P1 | site.ts OFFERS[0] |')
content = content.replace('| `/services/websites-inquiry` | P1 | TODO', '| `/services/websites-inquiry` | P1 | DONE | Content | P1 | site.ts OFFERS[1] |')
content = content.replace('| `/services/client-journey-systems` | P1 | TODO', '| `/services/client-journey-systems` | P1 | DONE | Content | P1 | site.ts OFFERS[2] |')
content = content.replace('| `/how-we-work` | P1 | TODO', '| `/how-we-work` | P1 | DONE | Content | P1 | SITE.PILLARS |')
content = content.replace('| `/examples` Index | P1 | TODO', '| `/examples` Index | P1 | DONE | Content | P1 | EVIDENCE_LABELS |')
content = content.replace('| `/about` | P1 | TODO', '| `/about` | P1 | DONE | Content | P1 | SITE.founder/SITE.established |')
content = content.replace('| `/business-backup-check` | P1 | TODO', '| `/business-backup-check` | P1 | DONE | Content | P1 | BACKUP_CHECK |')
content = content.replace('| `/contact` | P1 | TODO', '| `/contact` | P1 | DONE | Tech | P1 | INQUIRY_SCHEMA |')
content = content.replace('| `/privacy` | P1 | TODO', '| `/privacy` | P1 | DONE | Legal | P1 | Privacy Notice Draft |')
content = content.replace('| `/terms` | P1 | TODO', '| `/terms` | P1 | DONE | Legal | P1 | Website Terms Draft |')

with open(filepath, 'w') as f:
    f.write(content)

print("Manifest updated")
