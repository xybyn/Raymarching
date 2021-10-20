#version 410 core


uniform float time;
uniform vec2 resolution;
out vec4 color;
in vec2 point_position;
#define MAX_STEPS 20
#define MAX_DIST 100.
#define ACCURACY 0.01

float GetDist(vec3 p)
{
    vec4 sd = vec4(0, 1, 6, 1);

    float sdist = length(p-sd.xyz)-sd.w;
    float planedist = p.y;

    return min(sdist, planedist);
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
    vec2 e = vec2(0.001, 0);

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
    
    return dot(n, l);
}
void main()
{

    vec2 uv = point_position;


    vec3 ro =vec3(0, 1, 0);
    vec3 rd = normalize(vec3(uv.x, uv.y, 1));

    float d = ray_march(ro, rd);

    vec3 p = ro + rd * d;

    float diffuse = GetLight(p);
    
    color = vec4(vec3(diffuse), 1);

}