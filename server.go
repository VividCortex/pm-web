package main

import (
	"github.com/VividCortex/pm"

	"flag"
	"fmt"
	"math/rand"
	"sync"
	"time"
)

var statuses = []string{"starting",
	"waiting for requests",
	"accepting request",
	"receiving data",
	"querying database",
	"sending data",
	"sending response",
}

var pid = 0
var mutex sync.Mutex

var wg sync.WaitGroup

func SomeProcess() {
	wg.Add(1)
	go func() {
		mutex.Lock()
		pid++
		id := fmt.Sprint(pid)
		mutex.Unlock()

		defer func() {
			if r := recover(); r != nil {
				fmt.Printf("pid [%d] cancelled\n", pid)
			}
			wg.Done()
		}()

		pm.Start(id, nil, nil)
		defer pm.Done(id)

		for _, status := range statuses {
			time.Sleep(time.Duration((rand.Int()) % 7000 * int(time.Millisecond)))
			pm.Status(id, status)
		}

		SomeProcess()
	}()

}

func main() {
	port := flag.String("port", ":8081", "port string (ex. :8081)")
	flag.Parse()

	opts := pm.DefaultProclist.Options()
	opts.HttpHeaders = map[string]string{
		"Access-Control-Allow-Origin": "*",
	}
	pm.DefaultProclist.SetOptions(opts)
	go pm.ListenAndServe(*port)

	fmt.Printf("Listening on localhost%s\n", *port)

	for i := 0; i < 5; i++ {
		SomeProcess()
	}

	wg.Wait()
}
