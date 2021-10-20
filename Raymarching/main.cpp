#include <iostream>
#include <gl/glew.h>
#include <GLFW/glfw3.h>
#include "utils/Shader.h"
#include <vector>

using namespace std;
int main()
{
	constexpr int screen_width = 1200;
	constexpr int screen_height = 1200;


	glfwInit();

	glfwWindowHint(GLFW_SAMPLES, 4);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 0);

	GLFWwindow *window = glfwCreateWindow(screen_width, screen_height, "Raymraching Sample", nullptr, nullptr);

	glfwMakeContextCurrent(window);
	glfwSwapInterval(0);

	glViewport(0, 0, screen_width, screen_height);
	glPointSize(1);
	glewInit();

	Shader point_shader = Shader("shaders/test.vert", "shaders/test.frag");


	vector<float> vertices;
	vertices.reserve(2 * 4);


	//for (int i = 0; i < screen_height; i++)
	//{
	//	for (int j = 0; j < screen_width; j++)
	//	{
	//		vertices.push_back(2 * (i - screen_height / 2) / (float) screen_height);
	//		vertices.push_back(2 * (j - screen_width / 2) / (float) screen_width);
	//	}
	//}

	vertices.push_back(-1);
	vertices.push_back(1);

	vertices.push_back(-1);
	vertices.push_back(-1);

	vertices.push_back(1);
	vertices.push_back(-1);

	vertices.push_back(1);
	vertices.push_back(1);
	/*for (int i = 0; i < screen_height; i++)
	{
		for (int j = 0; j < screen_width; j++)
		{
			vertices.push_back(i - screen_height / 2);
			vertices.push_back(j - screen_width / 2);
		}
	}*/
	GLuint VAO, VBO;
	glGenBuffers(1, &VAO);
	glGenBuffers(1, &VBO);

	glGenVertexArrays(1, &VAO);
	glGenBuffers(1, &VBO);

	glBindVertexArray(VAO);
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(GLfloat) * vertices.size(), vertices.data(), GL_STATIC_DRAW);
	glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 2 * sizeof(GLfloat), (GLvoid *) 0);
	glEnableVertexAttribArray(0);
	glBindVertexArray(0);


	glBindVertexArray(VAO);
	while (!glfwWindowShouldClose(window))
	{
		glfwPollEvents();
		glClear(GL_COLOR_BUFFER_BIT);


		float time = glfwGetTime();


		point_shader.Use();
		point_shader.setFloat("time", time);
		int h;
		int w;
		glfwGetWindowSize(window, &w, &h);
		glViewport(0, 0, w, h);
		point_shader.setVec2("resolution", glm::vec2(w, h));



		glDrawArrays(GL_TRIANGLE_FAN, 0, 4);

		glfwSwapBuffers(window);
	}

	glfwDestroyWindow(window);
	glfwTerminate();
}

