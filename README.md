> 注：英文原版书籍代码下载地址：https://sites.google.com/site/webglbook/home ，我已下载放在本项目的public目录下。

##  项目初始化

1. [项目初始化](https://github.com/gisnotes/vite-vue3-webgl/commit/02f91301332b8fdc5791c5015798134968841fb7)
2. [集成WebGL编程指南一书提供的utils，并完成一个示例](https://github.com/gisnotes/vite-vue3-webgl/commit/1390a16c6a7c4d9c881aea643a617b821527418d)

## 第2章 WebGL 入门

1. [第一个webgl程序](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter02/HelloCanvas.vue)
2. [绘制一个点(版本1)](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter02/HelloPoint1.vue)
3. [绘制一个点(版本2)](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter02/HelloPoint2.vue)
4. [通过鼠标点击绘制点](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter02/ClickedPoints.vue)
5. [通过鼠标点击绘制不同颜色的点](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter02/ColoredPoints.vue)

## 第3章 绘制和变换三角形

1. [(一次性)绘制多个点](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter03/MultiPoint.vue)
2. [绘制一个三角形](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter03/HelloTriangle.vue)
3. [绘制多边形](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter03/HelloQuad.vue)
4. [平移三角形](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter03/TranslateTriangle.vue)
5. [旋转三角形](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter03/RotatedTriangle.vue)
6. [利用矩阵平移或旋转三角形](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter03/TranslateRotatedTriangleMatrix.vue)
7. [利用矩阵将三角形垂直方向(即y方向)上拉伸1.5倍](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter03/ScaledTriangleMatrix.vue)

## 第4章 高级变换与动画基础

1. [集成矩阵变换库cuon-matrix.js](https://github.com/gisnotes/vite-vue3-webgl/commit/da027fbeb019a5e17c593b32ca649b5b71ef8952)
2. [利用封装的matrix函数来旋转三角形](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter04/RotatedTriangle_Matrix4.vue)
3. [先平移后旋转(先旋转后平移)三角形](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter04/RotatedTranslatedTriangle.vue)
4. [(旋转三角形)动画](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter04/RotatingTriangle.vue)
4. [加速/减速三角形动画](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter04/RotatingTriangle_withButtons.vue)

## 第5章 颜色与纹理

1. [绘制多个不同尺寸的点(一)](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter05/MultiAttributeSize.vue)
2. [绘制多个不同尺寸的点(二)](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter05/MultiAttributeSize_Interleaved.vue)
3. [绘制多个不同颜色的点](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter05/MultiAttributeColor.vue)
4. [绘制彩色三角形(一)](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter05/ColoredTriangle.vue)
5. [绘制彩色三角形(二)](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter05/HelloTriangle_FragCoord.vue)
6. [在矩形表面贴上图像](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter05/TexturedQuad.vue)
7. [在矩形表面重复贴图](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter05/TexturedQuad_Repeat.vue)
8. [在矩形上重复贴图，并设置水平和垂直方向上重复贴图的方式](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter05/TexturedQuad_Clamp_Mirror.vue)
9. [使用多幅纹理](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter05/MultiTexture.vue)

## 第6章 OpenGL ES着色器语言（GLSL ES）
语法章节，代码略。

## 第7章 进入三维世界

1. [研究视点、观察目标点和上方向(一)](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter07/LookAtTriangles.vue)
2. [研究视点、观察目标点和上方向(二)](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter07/LookAtRotatedTriangles.vue)
3. [利用键盘动态改变视角](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter07/LookAtTrianglesWithKeys.vue)
4. [正射视图](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter07/OrthoView.vue)
5. [利用键盘动态改变视角(改为正射投影)](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter07/LookAtTrianglesWithKeys_ViewVolume.vue)
6. [透视(投影)视图](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter07/PerspectiveView.vue)
7. [透视(投影)视图-平移](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter07/PerspectiveView_mvp.vue)
8. [正确处理对象的前后关系-开启深度测试](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter07/DepthBuffer.vue)
9. [解决深度冲突](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter07/ZFighting.vue)
10. [绘制立方体](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter07/HelloCube.vue)
11. [绘制立方体——每个面用不同(单一)颜色渲染](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter07/ColoredCube.vue)

## 第8章 光照

1. [光照下的立方体](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter08/LightedCube.vue)
2. [环境光下的漫反射](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter08/LightedCube_ambient.vue)
3. [运动物体(平移+旋转)的光照效果](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter08/LightedTranslatedRotatedCube.vue)
4. [点光源光](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter08/PointLightedCube.vue)
5. [点光源光-动画版](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter08/PointLightedCube_animation.vue)
6. [点光源光-逐片元渲染](https://github.com/gisnotes/vite-vue3-webgl/blob/main/src/views/chapter08/PointLightedSphere_perFragment.vue)

## 第9章 层次模型

1. [待学习]()

## 第10章 高级技术

1. [待学习]()
