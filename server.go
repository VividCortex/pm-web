package main

import (
	"github.com/VividCortex/pm"

	"fmt"
	"math/rand"
	"sync"
	"time"
)

var statuses map[string]time.Duration = map[string]time.Duration{
	"starting":             time.Second,
	"waiting for requests": time.Second * 2,
	"accepting request":    time.Millisecond * 100,
	"receiving data":       time.Second,
	"querying database":    time.Second * 2,
	"sending data":         time.Second * 2,
	"sending response":     time.Second,
}

var wg sync.WaitGroup

func SomeProcess(pid int) {
	id := fmt.Sprint(pid)

	time.Sleep(time.Duration((rand.Int()) % 2000 * int(time.Millisecond)))

	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("pid [%d] cancelled\n", pid)
		}
		wg.Done()
	}()

	pm.Start(id, nil, nil)
	defer pm.Done(id)
	time.Sleep(time.Second)

	for status, dur := range statuses {
		elapsed := time.Duration(0)
		for elapsed != dur {
			time.Sleep(time.Millisecond * 250)
			elapsed += time.Millisecond * 250
			pm.CheckCancel(id)
		}

		pm.Status(id, status)
	}
}

func main() {
	go pm.ListenAndServe(":8081")

	for i := 0; i < 20; i++ {
		wg.Add(1)
		go SomeProcess(i)
	}

	wg.Wait()
}
