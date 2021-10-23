#version 410 core


uniform float time;
uniform vec2 resolution;
out vec4 color;
in vec2 point_position;
#define MAX_STEPS 50
#define MAX_DIST 100.
#define ACCURACY 0.01


float plane(vec3 p)
{
return p.y;
}
float spehere(vec3 p)
{
    vec4 sd = vec4(0, 1, 6, 1);
    return length(p-sd.xyz)-sd.w;
}

float Capsule(vec3 p, vec3 a, vec3 b, float r)
{
    vec3 ab = b-a;
    vec3 ap = p -a;

    float t = dot(ab, ap)/dot(ab, ab);
    t = clamp(t, 0, 1);
    vec3 c = a + t*ab;
      return length(p-c) -r ;
}
float Torus(vec3 p, vec2 r)
{
    
    vec3 pos = vec3(0, 0.5, 6);
    p-=pos;
    float x = length(p.xz)-r.x;
    return length(vec2(x, p.y)) - r.y;

}
float GetDist(vec3 p)
{
    
    float capsule = Capsule(p, vec3(0, 2, 6), vec3(1, 3, 6), .3);
    float sphere = spehere(p);
    float torus = Torus(p, vec2(1, 0.2));
    return min(capsule,min( plane(p), torus));
}


float ray_march(vec3 ro, vec3 rd)
{
    float dO = 0.0;

    for (int i = 0;i < MAX_STEPS;i++)
    {
        vec3 p = ro + rd * dO;
        float d = GetDist(p);
        dO += d;
        if(d < ACCURACY || dO > MAX_DIST)
            break;
    }
    return dO;

} 

vec3 GetNormal(vec3 p)
{
    float d = GetDist(p);
    vec2 e = vec2(0.01, 0);

    vec3 n = vec3(d) - vec3(
        GetDist(p-e.xyy),
        GetDist(p-e.yxy),
        GetDist(p-e.yyx));

    return normalize(n);
}

float GetLight(vec3 p)
{
    vec3 lightPos = vec3(4*sin(time), 5, 4*cos(time));
    vec3 l = normalize(lightPos - p);
    vec3 n = GetNormal(p);
    
    float d = ray_march(p+n*0.1, l);
    float diff = clamp(dot(n, l), 0., 1.0);
    if(d<length(lightPos-p))
        diff *=0.1;
    return diff;
}
void main()
{
    vec2 uv = gl_FragCoord.xy/resolution.xy - vec2(0.5, 0.5);
    uv.x *= resolution.x/resolution.y;
    
    vec3 ro =vec3(0, 1, 0);
    vec3 rd = normalize(vec3(uv.x, uv.y, 1));
    
    float d = ray_march(ro, rd);
    
    vec3 p = ro + rd * d;
    
    float diffuse = GetLight(p);
    
    color = vec4(vec3(1,1, 1)*diffuse, 1);
      
}