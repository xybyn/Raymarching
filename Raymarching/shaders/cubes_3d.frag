#version 410 core


uniform float time;
uniform vec2 resolution;
out vec4 color;
in vec2 point_position;


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

void main()
{
    vec2 uv = point_position;

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
    d += DrawPoint(ro, rd, vec3(0, 0, 0));
    d += DrawPoint(ro, rd, vec3(0, 0, 1));
    d += DrawPoint(ro, rd, vec3(0, -1, 0));
    d += DrawPoint(ro, rd, vec3(0, -1, 1));
    d += DrawPoint(ro, rd, vec3(1, 0, 0));
    d += DrawPoint(ro, rd, vec3(1, 0, 1));
    d += DrawPoint(ro, rd, vec3(1, -1, 0));
    d += DrawPoint(ro, rd, vec3(1, -1, 1));



    color = vec4(vec3(d ), 0);

}