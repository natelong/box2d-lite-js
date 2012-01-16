all:
	@mkdir -p target/js
	@java -jar lib/qpp-1.0.jar src/main/box2d-lite.js target/js/box2d-lite.js
	@cp -r src/test/* target/

clean:
	@rm -rf target

compile:
	@java -jar lib/closure/compiler/compiler.jar \
	@--js=target/box2d-lite.js \
	@--js_output_file=target/box2d-lite.min.js \
	@--compilation_level=SIMPLE_OPTIMIZATIONS