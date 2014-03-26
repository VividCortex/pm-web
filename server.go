package main

import (
	"flag"
	"fmt"
	"github.com/VividCortex/pm"
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
var mapPack map[string]interface{}

func SomeProcess() {
	wg.Add(1)
	go func() {
		mutex.Lock()
		pid++
		id := fmt.Sprint(pid)
		mutex.Unlock()

		defer func() {
			if r := recover(); r != nil {
				fmt.Printf("pid [%s] cancelled\n", id)
			}
			wg.Done()
		}()
		attributes := packValues()

		pm.Start(id, nil, &attributes)
		defer pm.Done(id)

		for _, status := range statuses {
			time.Sleep(time.Duration((rand.Int()) % 7000 * int(time.Millisecond)))
			pm.Status(id, status)
		}
		SomeProcess()
	}()

}

func randInt(min int, max int) int {
	rand.Seed(time.Now().UTC().UnixNano())
	return min + rand.Intn(max-min)
}

func packValues() map[string]interface{} {
	theMap := make(map[string]interface{})

	taste := []string{
		"salty",
		"sweet",
		"sour",
	}
	color := []string{
		"red",
		"green",
		"blue",
	}
	temperature := []string{
		"hot",
		"medium",
		"cold",
	}
	numAttrs := randInt(1, 4)
	for i := 0; i < numAttrs; i++ {
		d1 := randInt(1, 4)
		d2 := randInt(0, 3)
		switch d1 {
		case 1:
			theMap["Taste"] = taste[d2]
		case 2:
			theMap["Color"] = color[d2]
		case 3:
			theMap["Temperature"] = temperature[d2]
		}
	}
	return theMap
}

func main() {
	port := flag.String("port", ":8081", "port string (ex. :8081)")
	flag.Parse()

	go pm.ListenAndServe(*port)
	fmt.Printf("Listening on localhost%s\n", *port)

	for i := 0; i < 10; i++ {
		SomeProcess()
	}

	wg.Wait()
}
