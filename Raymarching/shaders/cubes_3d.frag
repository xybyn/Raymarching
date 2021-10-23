#version 410 core


uniform float time;
uniform vec2 resolution;
out vec4 color;
in vec2 point_position;
#define MAX_STEPS 20
#define MAX_DIST 100.
#define ACCURACY 0.01

float Circle(vec2 uv, vec2 p,  float r, float blur)
{
    float d = length(uv-p);

    float c = smoothstep(r, r-blur, d);
    return c;
}

float Rectangle(vec2 uv, float w, float h)
{
    return min(uv.y, uv.x);
}

float Band(float t, float a, float b)
{
    return smoothstep(a, b, t);
}

float DistLine(vec3 ro, vec3 rd, vec3 p)
{
    return length(cross(p-ro, rd))/length(rd);
}

float DrawPoint(vec3 ro, vec3 rd, vec3 p)
{
float d = DistLine(ro, rd, p);

    d = smoothstep(0.1, 0.09, d);
    return d;

}



float GetDist(vec3 p)
{
    return p.y;
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
    vec2 uv = gl_FragCoord.xy/resolution.xy - vec2(0.5, 0.5);
    uv.x *= resolution.x/resolution.y;


    vec2 circle_center = vec2(0, 0);
    
    //float circle1 = Circle(uv,vec2(cos(time)/2, sin(time)/2), 0.4, (cos(time)+1)/10);
    //float circle1 = Circle(uv,vec2(0, 0), 0.4, 0.01);
    //float circle2 = Circle(uv,vec2(0, 0), 0.1, 0.01);

    vec3 ro = vec3(3*cos(time), cos(time), 3*sin(time));

    vec3 point_of_view = vec3(0, 0, 0);

    vec3 forward = normalize(point_of_view-ro);

    vec3 right = cross(forward, vec3(0, 1, 0));
    vec3 up = cross(forward, right);
    
    float zoom = 1.0;
    vec3 center = ro + forward * zoom;
    vec3 i = center +uv.x*right + uv.y*up;
    vec3 rd = i -ro;

    float d = 0;
    d = GetLight();
    //d += DrawPoint(ro, rd, vec3(0, 0, 0));
    //d += DrawPoint(ro, rd, vec3(0, 0, 1));
    //d += DrawPoint(ro, rd, vec3(0, -1, 0));
    //d += DrawPoint(ro, rd, vec3(0, -1, 1));
    //d += DrawPoint(ro, rd, vec3(1, 0, 0));
    //d += DrawPoint(ro, rd, vec3(1, 0, 1));
    //d += DrawPoint(ro, rd, vec3(1, -1, 0));
    //d += DrawPoint(ro, rd, vec3(1, -1, 1));



    color = vec4(vec3(d ), 0);

}