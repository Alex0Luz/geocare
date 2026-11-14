import json,sys
import numpy as np, pymannkendall as mk
d=json.load(open(sys.argv[1]))['properties']['parameter']
for p,s in d.items():
    ks=sorted(k for k in s if not k.endswith('13'))
    v=np.array([s[k] for k in ks],float); v[v<-900]=np.nan
    m=v.reshape(-1,12); clim=np.nanmean(m,0); anom=(m-clim).ravel()
    ann=np.nanmean(m,1)
    r=mk.original_test(anom); rs=mk.seasonal_test(v,period=12)
    print(f"{p:12s} anos={len(ann)} MK anomalias: {r.trend:12s} p={r.p:.4f} Sen={r.slope*120:+.3f}/década | sazonal MK p={rs.p:.4f} | média 81-90={np.nanmean(ann[:10]):.2f} 16-25={np.nanmean(ann[-10:]):.2f}")
