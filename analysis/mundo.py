# Tendencias 1981-2025 em cidades do mundo (NASA POWER mensal). Codigo escrito com apoio de IA.
import json, urllib.request, concurrent.futures as cf, ssl
import numpy as np, pymannkendall as mk
C = {'Ciudad del Este':(-25.51,-54.61),'Sao Paulo':(-23.55,-46.63),'Buenos Aires':(-34.6,-58.38),'Lima':(-12.05,-77.04),
 'Bogota':(4.71,-74.07),'Mexico City':(19.43,-99.13),'Miami':(25.76,-80.19),'Phoenix':(33.45,-112.07),'New York':(40.71,-74.0),
 'Madrid':(40.42,-3.7),'Paris':(48.86,2.35),'Rome':(41.9,12.5),'Athens':(37.98,23.73),'Cairo':(30.04,31.24),'Lagos':(6.52,3.38),
 'Nairobi':(-1.29,36.82),'Addis Ababa':(9.03,38.74),'Johannesburg':(-26.2,28.05),'Karachi':(24.86,67.0),'Delhi':(28.61,77.21),
 'Dhaka':(23.81,90.41),'Kathmandu':(27.72,85.32),'Bangkok':(13.76,100.5),'Jakarta':(-6.2,106.85),'Manila':(14.6,120.98),
 'Tokyo':(35.68,139.69),'Shanghai':(31.23,121.47),'Sydney':(-33.87,151.21),'Niamey':(13.51,2.11),'Baghdad':(33.31,44.36)}
def briere(T,a=17.8,b=34.5):
    return np.where((T>a)&(T<b),T*(T-a)*np.sqrt(np.clip(b-T,0,None)),0)
REF = briere(np.linspace(17.8,34.5,2000)).max()
def get(item):
    n,(la,lo)=item
    u=f"https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=T2M,PRECTOTCORR,RH2M&community=AG&longitude={lo}&latitude={la}&start=1981&end=2025&format=JSON"
    for _ in range(3):
        try: return n,json.load(urllib.request.urlopen(u,timeout=90))['properties']['parameter']
        except Exception as e: err=e
    return n,None
out={}
with cf.ThreadPoolExecutor(5) as ex:
    for n,d in ex.map(get,C.items()):
        if not d: print(n,'FALHOU'); continue
        r={}
        for p in d:
            ks=sorted(k for k in d[p] if not k.endswith('13')); v=np.array([d[p][k] for k in ks],float).reshape(-1,12)
            an=(v-v.mean(0)).ravel(); t=mk.hamed_rao_modification_test(an); r[p]=(t.slope*120,t.p,v[:10].mean(),v[-10:].mean())
            if p=='T2M':
                idx=(briere(v)/REF).sum(1); t2=mk.hamed_rao_modification_test(idx); r['AEDES']=(t2.slope*10,t2.p,idx[:10].mean(),idx[-10:].mean())
        out[n]=r
json.dump(out,open('mundo.json','w'),indent=1)
print(f"{'cidade':16s} {'T C/dec':>8s} {'p':>7s} | {'chuva mm/d/dec':>14s} {'p':>6s} | {'UR %/dec':>8s} {'p':>6s} | Aedes 81-90 -> 16-25  (/dec, p)")
for n,r in sorted(out.items(), key=lambda kv:-kv[1]['T2M'][0]):
    T,P,R,A=r['T2M'],r['PRECTOTCORR'],r['RH2M'],r['AEDES']
    print(f"{n:16s} {T[0]:+8.2f} {T[1]:7.4f} | {P[0]:+14.2f} {P[1]:6.3f} | {R[0]:+8.2f} {R[1]:6.3f} | {A[2]:5.2f} -> {A[3]:5.2f} ({A[0]:+.2f}, p={A[1]:.3f})")
sigT=sum(1 for r in out.values() if r['T2M'][1]<0.05 and r['T2M'][0]>0); print('aquecimento significativo em',sigT,'de',len(out))
