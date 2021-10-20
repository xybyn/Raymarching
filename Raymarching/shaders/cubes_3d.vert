#version 410 core
layout (location = 0) in vec2 position;
out vec2 point_position;
uniform vec2 resolution;
void main()
{
	point_position = position/(resolution/2);
	gl_Position = vec4(point_position, 0, 1);
}