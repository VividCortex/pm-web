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

func SomeProcess(attributes *map[string]interface{}) {
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

		pm.Start(id, nil, attributes)
		defer pm.Done(id)

		for _, status := range statuses {
			time.Sleep(time.Duration((rand.Int()) % 7000 * int(time.Millisecond)))
			pm.Status(id, status)
		}

		SomeProcess(attributes)
	}()

}

// --- Not Inclusive of Maximum --- 
func randInt(min int , max int) int {
        rand.Seed( time.Now().UTC().UnixNano())
        return min + rand.Intn(max-min)
}

func main() {
	// --- Initialization
	mapPack:= make(map[string]interface{})
	taste := [] string{
		"salty", 
		"sweet", 
		"sour",
	}
	color := [] string{
		"red", 
		"green", 
		"blue",
	}
	temperature := [] string{
		"hot", 
		"medium", 
		"cold",
	}

	// --- Randomize the Attributes
	fmt.Println("RANDOMMMM")
	numAttrs := randInt(1, 4)
	for i:=0; i<numAttrs; i++ {
		d1 := randInt(1,4)
		d2 := randInt(0,3)
		switch d1 {
			case 1: mapPack["Taste"]=taste[d2]
			case 2: mapPack["Color"]=color[d2]
			case 3: mapPack["Temperature"]=temperature[d2]
		}
	}

	// --- Command Line Parsing ---
	port := flag.String("port", ":8081", "port string (ex. :8081)")
	flag.Parse()

	go pm.ListenAndServe(*port)

	// --- Command Line Checking ---
	fmt.Printf("Listening on localhost%s\n", *port)

	for i := 0; i < 20; i++ {
		fmt.Printf("Process %d\n", (i+1))
		SomeProcess(&mapPack)
	}

	// --- ??? ---
	wg.Wait()
}
