CXX := clang++
CXXFLAGS := -std=c++20 -Wall -Wextra -Wpedantic -fobjc-arc
FRAMEWORKS := -framework Cocoa
TARGET := blue-circle-game

.PHONY: all run test asset clean

all: $(TARGET)

$(TARGET): main.mm assets/blue_circle.png
	$(CXX) $(CXXFLAGS) main.mm $(FRAMEWORKS) -o $(TARGET)

run: $(TARGET)
	./$(TARGET)

test: $(TARGET)
	./$(TARGET) --self-test

asset:
	$(CXX) $(CXXFLAGS) tools/generate_circle.mm -framework Cocoa -framework ImageIO -o /tmp/blue-circle-asset-generator
	/tmp/blue-circle-asset-generator assets/blue_circle.png

clean:
	rm -f $(TARGET)
