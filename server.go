package main

import (
	"github.com/VividCortex/pm"

	"fmt"
	"time"
)

func main() {
	go pm.ListenAndServe(":8081")
	i := 0
	for {
		pm.Start(fmt.Sprint(i%10), nil, nil)
		time.Sleep(time.Millisecond * 100)
		i++
	}
}
