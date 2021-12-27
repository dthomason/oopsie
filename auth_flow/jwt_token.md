```
POST /oauth/token HTTP/1.1
Host: authorization-server.com
 
grant_type=refresh_token
&amp;refresh_token=xxxxxxxxxxx
&amp;client_id=xxxxxxxxxx
&amp;client_secret=xxxxxxxxxx
```

```.json
{
  "access_token": "BWjcyMzY3ZDhiNmJkNTY",
  "refresh_token": "Srq2NjM5NzA2OWJjuE7c",
  "token_type": "bearer",
  "expires": 3600
}
```

POST /api/auth/refresh
cookie or body
```
if cookie
refresh_token

access_token

if body
refreshToken

token
```
webhook event

example
```
POST /api/jwt/refresh HTTP/1.1
Cookie: refresh_token=xRxGGEpVawiUak6He367W3oeOfh+3irw+1G1h1jc; access_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFuYV91STRWbWxiMU5YVXZ0cV83SjZKZFNtTSJ9.eyJleHAiOjE1ODgzNTM0NjAsImlhdCI6MTU4ODM1MzQwMCwiaXNzIjoiZnVzaW9uYXV0aC5pbyIsInN1YiI6IjAwMDAwMDAwLTAwMDAtMDAwMS0wMDAwLTAwMDAwMDAwMDAwMCIsImF1dGhlbnRpY2F0aW9uVHlwZSI6IlBBU1NXT1JEIiwiZW1haWwiOiJ0ZXN0MEBmdXNpb25hdXRoLmlvIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXJuYW1lMCJ9.ZoIHTo3Pv0DpcELeX_wu-ZB_rd988jefZc2Ozu9_p59kttwqMm5PV8IDbgxJw9xcq9TFoNG8e_B6renoc11JC54UbiyeXBjF7EH01n9LDz-zTGqu9U72470Z4E7IPAHcyvJIBx4Mp9sgsEYAUm9Tb8ChudqNHhn6ZnXYI7Sew7CtGlu62f10wdBYGX0soYARHBv9CwhJC3-gsD2HLmqHAP_XhrpaYPNr5EAvmCHlM-JlTiEQ9bXwSc4gv-XbPQWamwy8Kcdb-g0EEAml_dC_b2CduwwYg0EoPQB3tQxzTUQzADi7K6q0CtQXv2_1VrRi6aQ4lt7v7t-Na39wGry_pA
```

response body example
```
{
  "refreshToken":"A0czpESaoeGxQdfanF3aFYzfo-AnsnKaqhjlHpzcROcRD91j7rgVBw",
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0ODc5NzU0NTgsImlhdCI6MTQ4Nzk3MTg1OCwiaXNzIjoiYWNtZS5jb20iLCJzdWIiOiI4NThhNGIwMS02MmM4LTRjMmYtYmZhNy02ZDAxODgzM2JlYTciLCJhcHBsaWNhdGlvbklkIjoiM2MyMTllNTgtZWQwZS00YjE4LWFkNDgtZjRmOTI3OTNhZTMyIiwicm9sZXMiOlsiYWRtaW4iXX0.O29_m_NDa8Cj7kcpV7zw5BfFmVGsK1n3EolCj5u1M9hZ09EnkaOl5n68OLsIcpCrX0Ue58qsabag3MCNS6H4ldt6kMnH6k4bVg4TvIjoR8WE-yGcu_xDUObYKZYaHWiNeuDL1EuQQI_8HajQLND-c9juy5ILuz6Fhx8CLfHCziEHX_aQPt7jQ2IIasVzprKkgvWS07Hiv2Oskryx49wqCesl46b-30c6nfttHUDEQrVq9gaepca3Nhjj_cPtC400JgLCN9DOYIbtd69zvD8vDUOvVzMr2HGdWtKthqa35NF-3xMZKD8CShe8ZT74fNd9YZ0WRE-YeIf3T_Hv5p5V2w"
}
```

possible responses
200
401 invalid
500 server error


decoded jwt payload
```
"jwt": {
  "aud": "lemonApp"
  "scope: ["openid, profile, offline_acces"]
  "exp": 123, //expire
  "iat": 123, //issued
  "iss": "localhost:3030",
  "roles": [
    "user"
  ],
  "sub": "234e34"
}
```