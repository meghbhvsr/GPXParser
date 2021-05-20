
#include "GPXParser.h"
#include "LinkedListAPI.h"

void deleteWaypoint(void* data) {
    if (data == NULL) {
        return;
    } else {
        Waypoint *tempWp = (Waypoint*)data;
        //if (tempWp->name != NULL) {
        free(tempWp->name);
        freeList(tempWp->otherData);
        free(tempWp);
    }
}
char* waypointToString( void* data) {
    if (data == NULL) {
        return NULL;
    } else {
        Waypoint * t = data;
        char *otherData = toString(t->otherData);
        char *out = calloc(20000 + strlen(otherData), sizeof(char*) * 300);
        sprintf(out, "waypoint name: %s , waypoint lat: %f , waypoint lon: %f, other data %s", t->name, t->latitude, t->longitude, otherData);
        free(otherData);
        return out;
    }
}

char* gpxDataToString( void* data) {
    if (data == NULL) {
        return NULL;
    }
    GPXData *tempGpx = data;
    char *out = malloc(100 + strlen(tempGpx->name) + strlen(tempGpx->value) + sizeof(tempGpx) + sizeof(char*) * 300);
    sprintf(out, "gpx name: %s ,gpx value: %s", tempGpx->name, tempGpx->value);
    return out;
}

int compareWaypoints(const void *first, const void *second) {
    return -1;
}

void deleteGpxData( void* data) {
    if (data == NULL) {
        return;
    } else {
        GPXData * tempGp = data;
        free(tempGp);
    }
}
int compareGpxData(const void *first, const void *second) {
    return -1;
}

void deleteRoute(void* data) {
    if (data == NULL) {
        return;
    } else {
        Route *tempRoute = data;
        free(tempRoute->name);
        freeList(tempRoute->waypoints);
        freeList(tempRoute->otherData);
        free(tempRoute);
    }
}
char* routeToString(void* data) {
    if (data == NULL) {
        return NULL;
    }
    Route * t = data;
    char *waypoints = toString(t->waypoints);
    if (waypoints == NULL) {
        return NULL;
    }
    char *otherData = toString(t->otherData);
    char *out = calloc(1000 + strlen(waypoints) + strlen(otherData), sizeof(char*) * 100);
    sprintf(out, " Other data: %s , Route name: %s , Route waypoints %s", otherData, t->name, waypoints);
    free(otherData);
    free(waypoints);
    return out;

}
int compareRoutes(const void *first, const void *second) {
    return -1;
}
void deleteTrack(void* data) {
    if (data == NULL) {
        return;
    } else {
        Track *tempTrack = data;
        free(tempTrack->name);
        freeList(tempTrack->segments);
        freeList(tempTrack->otherData);
        free(tempTrack);
    }
}
char* trackToString(void* data) {
    if (data == NULL) {
        return NULL;
    }
    Track * tempTrack = data;
    char *segments = toString(tempTrack->segments);
    char *otherData = toString(tempTrack->otherData);
    char *out = calloc(400 + strlen(segments) + strlen(otherData), sizeof(char*) * 100);
    sprintf(out, " Track Other data: %s , Track name: %s , Track Segments %s", otherData, tempTrack->name, segments);
    free(segments);
    free(otherData);
    return out;

}
int compareTracks(const void *first, const void *second) {
    return -1;
}

void deleteTrackSegment(void* data) {
    if (data == NULL) {
        return;
    } else {
        TrackSegment *tempSeg = data;
        freeList(tempSeg->waypoints);
        free(tempSeg);
    }
}

char* trackSegmentToString(void* data) {
    if (data == NULL) {
        return NULL;
    }
    TrackSegment *tempSeg = data;
    char *waypoints = toString(tempSeg->waypoints);
    return waypoints;
    
}

int compareTrackSegments(const void *first, const void *second) {
    return -1;
}
int getNumWaypoints(const GPXdoc* doc) {
    if (doc == NULL) {
        return 0;
    }
    //doc->waypoints
    int numOfWaypoints = 0;
    for (Node *n = doc->waypoints->head; n != NULL; n = n->next) {
        numOfWaypoints+=1;
    }
    return numOfWaypoints;
}

//Total number of routes in the GPX file
int getNumRoutes(const GPXdoc* doc) {
    if (doc == NULL) {
        return 0;
    }
    int numOfRoutes = 0;
    for (Node *n = doc->routes->head; n != NULL; n = n->next) {
        numOfRoutes+=1;
    }
    return numOfRoutes;
}

//Total number of tracks in the GPX file
int getNumTracks(const GPXdoc* doc) {
    if (doc == NULL) {
        return 0;
    }
    int numOfTracks = 0;
    for (Node *n = doc->tracks->head; n != NULL; n = n->next) {
        numOfTracks+=1;
    }
    return numOfTracks;
}

//Total number of segments in all tracks in the document
int getNumSegments(const GPXdoc* doc) {
    if (doc == NULL) {
        return 0;
    }
    int numOfSegments = 0;
    for (Node *tr = doc->tracks->head; tr != NULL; tr = tr->next) {
        numOfSegments += getLength(((Track*)tr->data)->segments);
    }
    return numOfSegments;
}

//Total number of GPXData elements in the document
int getNumGPXData(const GPXdoc* doc) {
    if (doc == NULL) {
        return 0;
    }
    Node *n = doc->waypoints->head;
    int numOfGpxData = 0;
    while (n != NULL) {
        Waypoint * theWaypoint = (Waypoint*) n->data;
        numOfGpxData += getLength(theWaypoint->otherData);
        if(strcmp(theWaypoint->name, "") != 0) {
            numOfGpxData++;
        }
        n = n->next;
    }
    Node *no = doc->routes->head;
    while (no != NULL) {
        Route * theRoute = (Route*) no->data;
        numOfGpxData += getLength(theRoute->otherData);
        if(strcmp(theRoute->name, "") != 0) {
            numOfGpxData++;
        }
        Node *no2 = theRoute->waypoints->head;
        while (no2 != NULL) {
            Waypoint * theWaypoint = (Waypoint*) no2->data;
            numOfGpxData += getLength(theWaypoint->otherData);
            if (strcmp(theWaypoint->name, "") != 0) {
                numOfGpxData++;
            }
            no2 = no2->next;
        }
        no = no->next;
    }
    Node *nod = doc->tracks->head;
    while (nod != NULL) {
        Track *theTrack = (Track*)nod->data;
        numOfGpxData += getLength(theTrack->otherData);
        if (strcmp(theTrack->name, "") != 0) {
            numOfGpxData++;
        }
        Node *nod2 = theTrack->segments->head;
        while (nod2 != NULL) {
            TrackSegment *theTrackSegment = (TrackSegment*) nod2->data;
            Node *nod3 = theTrackSegment->waypoints->head;
            while (nod3 != NULL) {
                Waypoint *theTrackSegWaypoint = (Waypoint*) nod3->data;
                numOfGpxData += getLength(theTrackSegWaypoint->otherData);
                if (strcmp(theTrackSegWaypoint->name, "") != 0) {
                    numOfGpxData++;
                }
                nod3 = nod3->next;
            }
            nod2 = nod2->next;
        }
        nod = nod->next;
    }
    return numOfGpxData;
}
Waypoint* getWaypoint(const GPXdoc* doc, char* name) {
    if (doc == NULL || name == NULL) {
        return NULL;
    }
    Waypoint * wp;
    Node *node = doc->waypoints->head;
    int flag = 0;
    while (node != NULL) {
        Waypoint *wpt = (Waypoint*)node->data;
        if(strcmp(wpt->name, name) == 0) {
            flag = 1;
            wp = (Waypoint*) node->data;
        }
        node = node->next;
    }
    if (flag == 0) {
        return NULL;
    }
    return wp;
}

Track* getTrack(const GPXdoc* doc, char* name) {
    if (doc == NULL || name == NULL) {
        return NULL;
    }
    Track * tr;
    Node *node = doc->tracks->head;
    int flag = 0;
    while (node != NULL) {
        Track *trk = (Track*)node->data;
        if(strcmp(trk->name, name) == 0) {
            flag = 1;
            tr = (Track*) node->data;
        }
        node = node->next;
    }
    if (flag == 0) {
        return NULL;
    }
    return tr;
}
// Function that returns a route with the given name.  If more than one exists, return the first one.  
// Return NULL if the route does not exist
Route* getRoute(const GPXdoc* doc, char* name) {
    if (doc == NULL || name == NULL) {
        return NULL;
    }
    Route * rt;
    Node *node = doc->routes->head;
    int flag = 0;
    while (node != NULL) {
        Route *rte = (Route*)node->data;
        if(strcmp(rte->name, name) == 0) {
            flag = 1;
            rt = (Route*) node->data;
        }
        node = node->next;
    }
    if (flag == 0) {
        return NULL;
    }
    return rt;
}

float round10(float len) {
    if (len < 0) {
        return 0;
    }
    int z = (len + 5)/10;
    z = z * 10;
    return z;
}

GPXdoc* createValidGPXdoc(char* fileName, char* gpxSchemaFile) {
    xmlDocPtr doc;
    xmlSchemaPtr theSchema = NULL;
    xmlSchemaParserCtxtPtr textC;
    char *XMLFileName = fileName;
    char *XSDFileName = gpxSchemaFile;
    GPXdoc * structDocs = NULL;
    xmlLineNumbersDefault(1);

    textC = xmlSchemaNewParserCtxt(XSDFileName);

    xmlSchemaSetParserErrors(textC, (xmlSchemaValidityErrorFunc) fprintf, (xmlSchemaValidityWarningFunc) fprintf, stderr);
    theSchema = xmlSchemaParse(textC);
    xmlSchemaFreeParserCtxt(textC);
    //xmlSchemaDump(stdout, schema); //To print schema dump

    doc = xmlReadFile(XMLFileName, NULL, 0);

    if (doc == NULL){
        //fprintf(stderr, "Could not parse %s\n", XMLFileName);
    }else{
        xmlSchemaValidCtxtPtr textC2;
        int ret;
        textC2 = xmlSchemaNewValidCtxt(theSchema);
        xmlSchemaSetValidErrors(textC2, (xmlSchemaValidityErrorFunc) fprintf, (xmlSchemaValidityWarningFunc) fprintf, stderr);
        ret = xmlSchemaValidateDoc(textC2, doc);
        if (ret == 0){
            //printf("%s validates\n", XMLFileName);
            structDocs = createGPXdoc(fileName);
        }else if (ret > 0){
            printf("%s fails to validate\n", XMLFileName);
        }else{
            printf("%s validation generated an internal error\n", XMLFileName);
        }
        xmlSchemaFreeValidCtxt(textC2);
        xmlFreeDoc(doc);
    }

    // free the resource
    if(theSchema != NULL){
        xmlSchemaFree(theSchema);
    }

    xmlSchemaCleanupTypes();
    xmlCleanupParser();
    xmlMemoryDump();
    return structDocs;
}

bool validateOtherData(List *otherData) {
    Node *node = otherData->head;
    bool a = true;
    if (otherData == NULL) {
        a = false;
    }
    while (node != NULL) {
        GPXData *gpx = (GPXData*)node->data;
        if (strcmp(gpx->name, "") == 0) {
            a = false;
        }
        if (strcmp(gpx->value, "") == 0) {
            a = false;
        }
        node = node->next;
    }
    return a;
}

bool validateWaypoints(List *waypoints) {
    bool a = true;
    if (waypoints == NULL) {
        a = false;
    }
    Node *node = waypoints->head;
    while (node != NULL) {
        Waypoint *wpt = (Waypoint*)node->data;
        if(wpt->name == NULL) {
            a = false;
        }
        if (validateOtherData(wpt->otherData) == false) {
            a = false;
        }
        node = node->next;
    }
    return a;
}
bool validateSegments(List *segments) {
    bool a = true;
    if (segments == NULL) {
        a = false;
    }
    Node *node = segments->head;
    while (node != NULL) {
        TrackSegment *trckseg = (TrackSegment*)node->data;
        if (validateWaypoints(trckseg->waypoints) == false) {
            a = false;
        }
        node = node->next;
    }
    return a;
}

xmlNodePtr gpxDocToNode(GPXdoc* doc) {
     if (doc == NULL) {
        return false;
    }
    char buff[1000];
    xmlDocPtr docs = NULL;
    xmlNsPtr ptr = NULL;
    xmlNodePtr root_node = NULL, node1 = NULL, node2 = NULL, node3 = NULL, node4 = NULL, node5 = NULL, node6 = NULL;
    root_node = xmlNewNode(NULL, BAD_CAST "gpx");
    sprintf(buff, "%0.1f", doc->version);
    xmlNewProp(root_node, BAD_CAST "version",BAD_CAST buff);
    xmlNewProp(root_node, BAD_CAST "creator",BAD_CAST doc->creator);
    ptr = xmlNewNs(root_node, BAD_CAST doc->namespace, NULL);
    xmlSetNs(root_node, ptr);
    //xmlNewProp(root_node, BAD_CAST "xsi:schemaLocation",BAD_CAST doc->namespace);
    Node * node = doc->waypoints->head;
    while (node != NULL) {
        Waypoint *wpt = (Waypoint*)node->data;
        node1 = xmlNewChild(root_node, NULL, BAD_CAST "wpt", NULL);
        if (strcmp(wpt->name, "") != 0) {
            xmlNewChild(node1, NULL, BAD_CAST "name", BAD_CAST buff);
        }
        sprintf(buff, "%lf", wpt->latitude);
        xmlNewProp(node1, BAD_CAST "lat", BAD_CAST buff);
        sprintf(buff, "%lf", wpt->longitude);
        xmlNewProp(node1, BAD_CAST "lon", BAD_CAST buff);
        sprintf(buff, "%s", wpt->name);
        Node * node2 = wpt->otherData->head;
        while(node2 != NULL) {
            GPXData * gpx = (GPXData*)node2->data;
            xmlNewChild(node1, NULL, BAD_CAST gpx->name, BAD_CAST gpx->value);
            node2 = node2->next;
        }
        node = node->next;
    }
    Node *nodeRoute = doc->routes->head;
    while (nodeRoute != NULL) {
        Route *rt = (Route*)nodeRoute->data;
        node2 = xmlNewChild(root_node, NULL, BAD_CAST "rte", NULL);
        if (strcmp(rt->name, "") != 0) {
            xmlNewChild(node2, NULL, BAD_CAST "name", BAD_CAST rt->name);
        }
        Node *routeOther = rt->otherData->head;
        while(routeOther != NULL) {
            GPXData * gpx5 = (GPXData*)routeOther->data;
            xmlNewChild(node2, NULL, BAD_CAST gpx5->name, BAD_CAST gpx5->value);
            routeOther = routeOther->next;
        }
        Node * nodeWay = rt->waypoints->head;
        while (nodeWay != NULL) {
            Waypoint *wpt2 = (Waypoint*)nodeWay->data;
            node3 = xmlNewChild(node2, NULL, BAD_CAST "rtept", NULL);
            if (strcmp(wpt2->name, "") != 0) {
                xmlNewChild(node3, NULL, BAD_CAST "name", BAD_CAST wpt2->name);
            }
            sprintf(buff, "%lf", wpt2->latitude);
            xmlNewProp(node3, BAD_CAST "lat", BAD_CAST buff);
            sprintf(buff, "%lf", wpt2->longitude);
            xmlNewProp(node3, BAD_CAST "lon", BAD_CAST buff);
            
            Node * nodeWayOther = wpt2->otherData->head;
            while(nodeWayOther != NULL) {
                GPXData * gpx2 = (GPXData*)nodeWayOther->data;
                xmlNewChild(node3, NULL, BAD_CAST gpx2->name, BAD_CAST gpx2->value);
                nodeWayOther = nodeWayOther->next;
            }
            nodeWay = nodeWay->next;
        }
        
        nodeRoute = nodeRoute->next;
    }
    Node * nodeTrack = doc->tracks->head;
    while (nodeTrack != NULL) {
        Track *trk = (Track*)nodeTrack->data;
        node4 = xmlNewChild(root_node, NULL, BAD_CAST "trk", NULL);
        if (strcmp(trk->name, "") != 0) {
            xmlNewChild(node4, NULL, BAD_CAST "name", BAD_CAST trk->name);
        }
        Node *trackOther = trk->otherData->head;
        while(trackOther != NULL) {
            GPXData * gpx3 = (GPXData*)trackOther->data;
            xmlNewChild(node4, NULL, BAD_CAST gpx3->name, BAD_CAST gpx3->value);
            trackOther = trackOther->next;
        }
        Node *trackSegments = trk->segments->head;
        while(trackSegments != NULL) {
            TrackSegment * seg = (TrackSegment*)trackSegments->data;
            node6 = xmlNewChild(node4, NULL, BAD_CAST "trkseg", NULL);
            Node * trackWay = seg->waypoints->head;
            while (trackWay != NULL) {
                Waypoint *wpt3 = (Waypoint*)trackWay->data;
                node5 = xmlNewChild(node6, NULL, BAD_CAST "trkpt", NULL);
                sprintf(buff, "%lf", wpt3->latitude);
                xmlNewProp(node5, BAD_CAST "lat", BAD_CAST buff);
                sprintf(buff, "%lf", wpt3->longitude);
                xmlNewProp(node5, BAD_CAST "lon", BAD_CAST buff);
                if (strcmp(wpt3->name, "") != 0) {
                    xmlNewChild(node5, NULL, BAD_CAST "name", BAD_CAST wpt3->name);
                }
                Node * TrackwayOther = wpt3->otherData->head;
                while(TrackwayOther != NULL) {
                    GPXData * gpx4 = (GPXData*)TrackwayOther->data;
                    xmlNewChild(node5, NULL, BAD_CAST gpx4->name, BAD_CAST gpx4->value);
                    TrackwayOther = TrackwayOther->next;
                }
                trackWay = trackWay->next;
            }
            trackSegments = trackSegments->next;
        }
        
        nodeTrack = nodeTrack->next;
    }
    xmlFreeDoc(docs);
    xmlCleanupParser();
    xmlMemoryDump();
    return root_node;
}
bool writeGPXdoc(GPXdoc*doc,char*fileName) {
    if (doc == NULL || fileName == NULL) {
        return false;
    }
    
    char buff[1000];
    xmlDocPtr docs = NULL;
    xmlNsPtr ptr = NULL;
    xmlNodePtr root_node = NULL, node1 = NULL, node2 = NULL, node3 = NULL, node4 = NULL, node5 = NULL, node6 = NULL;
    docs = xmlNewDoc(BAD_CAST "1.0");
    root_node = xmlNewNode(NULL, BAD_CAST "gpx");
    xmlDocSetRootElement(docs, root_node);
    sprintf(buff, "%0.1f", doc->version);
    xmlNewProp(root_node, BAD_CAST "version",BAD_CAST buff);
    xmlNewProp(root_node, BAD_CAST "creator",BAD_CAST doc->creator);
    ptr = xmlNewNs(root_node, BAD_CAST doc->namespace, NULL);
    xmlSetNs(root_node, ptr);
    //xmlNewProp(root_node, BAD_CAST "xsi:schemaLocation",BAD_CAST doc->namespace);
    if (doc->waypoints != NULL) {
        Node * node = doc->waypoints->head;
        while (node != NULL) {
            Waypoint *wpt = (Waypoint*)node->data;
            node1 = xmlNewChild(root_node, NULL, BAD_CAST "wpt", NULL);
            if (strcmp(wpt->name, "") != 0) {
                xmlNewChild(node1, NULL, BAD_CAST "name", BAD_CAST buff);
            }
            sprintf(buff, "%lf", wpt->latitude);
            xmlNewProp(node1, BAD_CAST "lat", BAD_CAST buff);
            sprintf(buff, "%lf", wpt->longitude);
            xmlNewProp(node1, BAD_CAST "lon", BAD_CAST buff);
            sprintf(buff, "%s", wpt->name);
            Node * node2 = wpt->otherData->head;
            while(node2 != NULL) {
                GPXData * gpx = (GPXData*)node2->data;
                xmlNewChild(node1, NULL, BAD_CAST gpx->name, BAD_CAST gpx->value);
                node2 = node2->next;
            }
            node = node->next;
        }
    }
    if (doc->routes != NULL) {
        Node *nodeRoute = doc->routes->head;
        while (nodeRoute != NULL) {
            Route *rt = (Route*)nodeRoute->data;
            node2 = xmlNewChild(root_node, NULL, BAD_CAST "rte", NULL);
            if (strcmp(rt->name, "") != 0) {
                xmlNewChild(node2, NULL, BAD_CAST "name", BAD_CAST rt->name);
            }
            Node *routeOther = rt->otherData->head;
            while(routeOther != NULL) {
                GPXData * gpx5 = (GPXData*)routeOther->data;
                xmlNewChild(node2, NULL, BAD_CAST gpx5->name, BAD_CAST gpx5->value);
                routeOther = routeOther->next;
            }
            Node * nodeWay = rt->waypoints->head;
            while (nodeWay != NULL) {
                Waypoint *wpt2 = (Waypoint*)nodeWay->data;
                node3 = xmlNewChild(node2, NULL, BAD_CAST "rtept", NULL);
                if (strcmp(wpt2->name, "") != 0) {
                    xmlNewChild(node3, NULL, BAD_CAST "name", BAD_CAST wpt2->name);
                }
                sprintf(buff, "%lf", wpt2->latitude);
                xmlNewProp(node3, BAD_CAST "lat", BAD_CAST buff);
                sprintf(buff, "%lf", wpt2->longitude);
                xmlNewProp(node3, BAD_CAST "lon", BAD_CAST buff);
                
                Node * nodeWayOther = wpt2->otherData->head;
                while(nodeWayOther != NULL) {
                    GPXData * gpx2 = (GPXData*)nodeWayOther->data;
                    xmlNewChild(node3, NULL, BAD_CAST gpx2->name, BAD_CAST gpx2->value);
                    nodeWayOther = nodeWayOther->next;
                }
                nodeWay = nodeWay->next;
            }
            
            nodeRoute = nodeRoute->next;
        }
    }
    if (doc->tracks != NULL) {
        Node * nodeTrack = doc->tracks->head;
        while (nodeTrack != NULL) {
            Track *trk = (Track*)nodeTrack->data;
            node4 = xmlNewChild(root_node, NULL, BAD_CAST "trk", NULL);
            if (strcmp(trk->name, "") != 0) {
                xmlNewChild(node4, NULL, BAD_CAST "name", BAD_CAST trk->name);
            }
            Node *trackOther = trk->otherData->head;
            while(trackOther != NULL) {
                GPXData * gpx3 = (GPXData*)trackOther->data;
                xmlNewChild(node4, NULL, BAD_CAST gpx3->name, BAD_CAST gpx3->value);
                trackOther = trackOther->next;
            }
            Node *trackSegments = trk->segments->head;
            while(trackSegments != NULL) {
                TrackSegment * seg = (TrackSegment*)trackSegments->data;
                node6 = xmlNewChild(node4, NULL, BAD_CAST "trkseg", NULL);
                Node * trackWay = seg->waypoints->head;
                while (trackWay != NULL) {
                    Waypoint *wpt3 = (Waypoint*)trackWay->data;
                    node5 = xmlNewChild(node6, NULL, BAD_CAST "trkpt", NULL);
                    sprintf(buff, "%lf", wpt3->latitude);
                    xmlNewProp(node5, BAD_CAST "lat", BAD_CAST buff);
                    sprintf(buff, "%lf", wpt3->longitude);
                    xmlNewProp(node5, BAD_CAST "lon", BAD_CAST buff);
                    if (strcmp(wpt3->name, "") != 0) {
                        xmlNewChild(node5, NULL, BAD_CAST "name", BAD_CAST wpt3->name);
                    }
                    Node * TrackwayOther = wpt3->otherData->head;
                    while(TrackwayOther != NULL) {
                        GPXData * gpx4 = (GPXData*)TrackwayOther->data;
                        xmlNewChild(node5, NULL, BAD_CAST gpx4->name, BAD_CAST gpx4->value);
                        TrackwayOther = TrackwayOther->next;
                    }
                    trackWay = trackWay->next;
                }
                trackSegments = trackSegments->next;
            }
            
            nodeTrack = nodeTrack->next;
        }
    }
    
    xmlSaveFormatFileEnc(fileName, docs, "UTF-8", 1);
    xmlFreeDoc(docs);
    //xmlCleanupParser();
    xmlMemoryDump();
    return true;
}
bool validateGPXDoc(GPXdoc* doc, char* gpxSchemaFile) {
    bool a = true;
    if (doc == NULL || gpxSchemaFile == NULL) {
        return false;
    }
    xmlDoc *theDoc = NULL;
    xmlNode *rootNode = NULL;
    xmlSchemaPtr theSchema = NULL;
    int val = 0;
    theDoc = xmlNewDoc(BAD_CAST "1.0");
    rootNode = gpxDocToNode(doc);
    xmlDocSetRootElement(theDoc, rootNode);
    xmlSchemaParserCtxtPtr textC;
    xmlLineNumbersDefault(1);
    textC = xmlSchemaNewParserCtxt(gpxSchemaFile);
    xmlSchemaSetParserErrors(textC, (xmlSchemaValidityErrorFunc) fprintf, (xmlSchemaValidityWarningFunc) fprintf, stderr);
    theSchema = xmlSchemaParse(textC);
    xmlSchemaFreeParserCtxt(textC);
    xmlSchemaValidCtxtPtr textC2;
    textC2 = xmlSchemaNewValidCtxt(theSchema);
    xmlSchemaSetValidErrors(textC2, (xmlSchemaValidityErrorFunc) fprintf, (xmlSchemaValidityWarningFunc) fprintf, stderr);
    val = xmlSchemaValidateDoc(textC2, theDoc);
    if (val != 0) {
        a = false;
    }
    xmlSchemaFreeValidCtxt(textC2);
    if (theSchema != NULL) {
        xmlSchemaFree(theSchema); 
    }
    xmlSchemaCleanupTypes();
    xmlFreeDoc(theDoc);
    xmlCleanupParser();
    xmlMemoryDump();
    if (strcmp(doc->namespace, "") == 0) {
        a = false;
    }
    if (doc->creator == NULL || strcmp(doc->creator, "") == 0) {
        a = false;
    }
    if (validateWaypoints(doc->waypoints) == false) {
        return false;
    }
    if (doc->routes == NULL) {
        return false;
    }
    if (doc->tracks == NULL) {
       return false;
    }
    Node *node = doc->routes->head;
    while (node != NULL) {
        Route *rt = (Route*)node->data;
        if(rt->name == NULL) {
            a = false;
        }
        if (validateWaypoints(rt->waypoints) == false) {
            a = false;
        }
        if (validateOtherData(rt->otherData) == false) {
            a = false;
        }
        node = node->next;
    }

    Node *node2 = doc->tracks->head;
    while (node2 != NULL) {
        Track *track = (Track*)node2->data;
        if(track->name == NULL) {
            a = false;
        }
        if (validateOtherData(track->otherData) == false) {
            a = false;
        }
        if (validateSegments(track->segments) == false) {
            a = false;
        }
        node2 = node2->next;
    }
    return a;
}

float calculateHaversine(Waypoint *wpt, Waypoint *wpt2) {
    float r = 6371e3;
    float lat1 = wpt->latitude * M_PI/180;
    float lat2 = wpt2->latitude * M_PI/180;
    float lon1 = wpt->longitude * M_PI/180;
    float lon2 = wpt2->longitude * M_PI/180;
    float dLat = lat2 - lat1;
    float dLong = lon2 - lon1;
    float a = pow(sin(dLat/2), 2) + (cos(lat1) * cos(lat2) * pow(sin(dLong/2), 2));
    float c = 2 * atan2(sqrt(a), sqrt(1-a));
    return r * c;
}
float getRouteLen(const Route *rt) {
    float totalLength = 0;
    if (rt == NULL) {
        return 0;
    } 
    if (getLength(rt->waypoints) == 0) {
        return 0;
    }
    Node *node = rt->waypoints->head;
    while (node->next != NULL) {
        Waypoint *wpt = (Waypoint*)node->data;
        Waypoint *wpt2 = (Waypoint*)node->next->data;
        totalLength += calculateHaversine(wpt, wpt2);
        node = node->next;
    }
    return totalLength;
}
void deleteWpTemp(void *data) {}
float getTrackLen(const Track *tr) {
    float totalLength = 0;
    if (tr == NULL) {
        return 0;
    }
    if (getLength(tr->segments) == 0) {
        return 0;
    }
    Node *node = tr->segments->head;
    List *allTrackWaypoints = initializeList(&waypointToString, &deleteWpTemp, &compareWaypoints);
    while(node != NULL) {
        TrackSegment *seg = (TrackSegment*)node->data;
        Node *node2 = seg->waypoints->head;
        while(node2 != NULL) {
            Waypoint *wpt = (Waypoint*)node2->data;
            insertBack(allTrackWaypoints,wpt);
            node2 = node2->next;
        }
        node = node->next;
    }
    Node *node3 = allTrackWaypoints->head;
    while (node3->next != NULL) {
        Waypoint * wpt1 = (Waypoint*) node3->data;
        Waypoint * wpt2 = (Waypoint*) node3->next->data;
        totalLength += calculateHaversine(wpt1, wpt2);
        node3 = node3->next;
    }
    freeList(allTrackWaypoints);
    return totalLength;
}

int numRoutesWithLength(const GPXdoc* doc, float len, float delta) {
    if (doc == NULL || len < 0 || delta < 0) {
        return 0;
    }
    int numOfRoutes = 0;
    Node *node = doc->routes->head;
    while(node != NULL) {
        Route *rt = (Route*)node->data;
        if (fabs(getRouteLen(rt) - len) <= delta) {
            numOfRoutes++;
        }
        node = node->next;
    }
    return numOfRoutes;
}

int numTracksWithLength(const GPXdoc* doc, float len, float delta) {
    if (doc == NULL || len < 0 || delta < 0) {
        return 0;
    }
    int numOfTracks = 0;
    Node *node = doc->tracks->head;
    while(node != NULL) {
        Track *tr = (Track*)node->data;
        if (fabs(getTrackLen(tr) - len) <= delta) {
            numOfTracks++;
        }
        node = node->next;
    }
    return numOfTracks;
}
bool isLoopRoute(const Route* route, float delta) {
    if (route == NULL || delta < 0 ) {
        return false;
    }

    int numOfWaypoints = 0;
    float diff = 0;
    if (getLength(route->waypoints) == 0) {
        return false;
    }
    Node *node = route->waypoints->head;
    
    Waypoint *startWp = (Waypoint*)node->data;
    Waypoint *endWp;
    while (node != NULL) {
        numOfWaypoints++;
        if (node->next == NULL) {
            endWp = (Waypoint*) node->data;
        }
        node = node->next;
    }
    bool stat = false;
    diff = calculateHaversine(startWp, endWp);
    if (diff <= delta && numOfWaypoints >= 4) {
        stat = true;
    }
    return stat;
}
bool isLoopTrack(const Track *tr, float delta) {
    if (tr == NULL || delta < 0) {
        return false;
    }
    bool stat = false;
    int flag = 0;
    int numOfWaypoints = 0;
    if (getLength(tr->segments) == 0) {
        return false;
    }
    Node *node = tr->segments->head;
    List *allTrackWaypoints = initializeList(&waypointToString, &deleteWpTemp, &compareWaypoints);
    while(node != NULL) {
        TrackSegment *seg = (TrackSegment*)node->data;
        Node *node2 = seg->waypoints->head;
        while(node2 != NULL) {
            numOfWaypoints++;
            Waypoint *wpt = (Waypoint*)node2->data;
            insertBack(allTrackWaypoints,wpt);
            node2 = node2->next;
        }
        if (numOfWaypoints >= 4) {
            flag = 1;
        }
        node = node->next;
    }
    Node *node3 = allTrackWaypoints->head;
    Waypoint *startWp = (Waypoint*)node3->data;
    Waypoint *endWp;
    while (node3 != NULL) {
        if (node3->next == NULL) {
            endWp = (Waypoint*) node3->data;
        }
        node3 = node3->next;
    }
    float diff = calculateHaversine(startWp, endWp);
    if (diff <= delta && flag == 1) {
        stat = true;
    }
    freeList(allTrackWaypoints); 
    return stat;
}
void dummyRouteDelete(void *data) {return;}
List* getRoutesBetween(const GPXdoc* doc, float sourceLat, float sourceLong, float destLat, float destLong, float delta) {
    if (doc == NULL) {
        return NULL;
    }
    Waypoint *wpStart = malloc(sizeof(Waypoint));
    Waypoint *wpEnd = malloc(sizeof(Waypoint));
    wpStart->latitude = sourceLat;
    wpStart->longitude = sourceLong;
    wpEnd->latitude = destLat;
    wpEnd->longitude = destLong;
    List *routes = initializeList(routeToString, dummyRouteDelete, compareRoutes);
    Node *node = doc->routes->head;
    while (node != NULL) {
        Route *rt = (Route*)node->data;
        if (getLength(rt->waypoints) <= 0) {
            free(wpStart);
            free(wpEnd);
            freeList(routes);
            return NULL;
        }
        Waypoint *wp1 = (Waypoint*)rt->waypoints->head->data;
        Waypoint *wp2 = (Waypoint*)rt->waypoints->tail->data;
        if (calculateHaversine(wpStart, wp1) <= delta && calculateHaversine(wpEnd, wp2) <= delta) {
            insertBack(routes, rt);
        } 
        node = node->next;
    }

    free(wpStart);
    free(wpEnd);
    if (getLength(routes) > 0) {
        return routes;
    } else {
        free(routes);
        return NULL;
    }
    return routes;
}
List* getTracksBetween(const GPXdoc* doc, float sourceLat, float sourceLong, float destLat, float destLong, float delta) {
    if (doc == NULL) {
        return NULL;
    }
    Waypoint *wpStart = malloc(sizeof(Waypoint));
    Waypoint *wpEnd = malloc(sizeof(Waypoint));
    wpStart->latitude = sourceLat;
    wpStart->longitude = sourceLong;
    wpEnd->latitude = destLat;
    wpEnd->longitude = destLong;
    
    List *tracks = initializeList(trackToString, dummyRouteDelete, compareTracks);
    
    Node *node = doc->tracks->head;
    while (node != NULL) {
        Track *tr = (Track*)node->data;
        if (getLength(tr->segments) <= 0) {
            free(wpStart);
            free(wpEnd);
            freeList(tracks);
            return NULL;
        }
        Node *node2 = tr->segments->head;
        List *wp = initializeList(waypointToString, dummyRouteDelete, compareWaypoints);
        while (node2 != NULL) {
            TrackSegment *trseg = (TrackSegment*)node2->data;
            Node *node3 = trseg->waypoints->head;
            while (node3 != NULL) {
                Waypoint * trsegWp1 = (Waypoint*)node3->data;
                insertBack(wp, trsegWp1);
                node3 = node3->next;
            }
            node2 = node2->next;
        }
        Waypoint * trsegWp1 = (Waypoint*)wp->head->data;
        Waypoint * trsegWp2 = (Waypoint*)wp->tail->data;
        if (calculateHaversine(wpStart, trsegWp1) <= delta && calculateHaversine(wpEnd, trsegWp2) <= delta) {   
            insertBack(tracks, tr);
        }
        freeList(wp);
        
        node = node->next;
    }
    free(wpStart);
    free(wpEnd);
    if(getLength(tracks) > 0) {
        return tracks;
    } else {
        freeList(tracks);
        return NULL;
    }
    return tracks;
}

char* trackToJSON(const Track *tr) {
    char *buffer = malloc(50000);
    if (tr == NULL) {
        strcpy(buffer, "{}");
        return buffer;
    }
    char *name = malloc(100);
    if (strcmp(tr->name, "") == 0) {
        strcpy(name, "None");
    } else {
        strcpy(name, tr->name);
    }
    sprintf(buffer, "{%cname%c:%c%s%c,%clen%c:%.1f,%cloop%c:%s}", '"', '"', '"', name, '"', '"', '"', round10(getTrackLen(tr)), '"', '"', isLoopTrack(tr,15) ? "true" : "false");
    free(name);
    return buffer;
}
char* routeToJSON(const Route *rt) {
    char *buffer = malloc(50000);
    if (rt == NULL) {
        strcpy(buffer, "{}");
        return buffer;
    }
    char *name = malloc(100);
    if (strcmp(rt->name, "") == 0) {
        strcpy(name,"None");
    } else {
        strcpy(name, rt->name);
    }
    int totalPoints = 0;
    Node *node = rt->waypoints->head;
    while (node != NULL) {
        totalPoints++;
        node = node->next;
    }
    
    sprintf(buffer, "{%cname%c:%c%s%c,%cnumPoints%c:%d,%clen%c:%.1f,%cloop%c:%s}", '"', '"', '"', name, '"', '"', '"',totalPoints, '"', '"', round10(getRouteLen(rt)), '"', '"', isLoopRoute(rt,15) ? "true" : "false");
    free(name);
    return buffer;
}

char* routeListToJSON(const List *list) {
    char *buffer = malloc(50000);
    if (list == NULL || list->length <= 0) {
        strcpy(buffer, "[]");
        return buffer;
    }
    Node *node = list->head;
    strcpy(buffer, "[");
    while (node != NULL) {
        const Route *rt = (const Route*)node->data;
        char *buffer2 = routeToJSON(rt);
        strcat(buffer, buffer2);
        free(buffer2);
        if (node->next != NULL) {
            strcat(buffer, ",");
        }
        node = node->next;
    }
    strcat(buffer, "]");
    return buffer;    
}

char* trackListToJSON(const List *list) {
    if (list == NULL) {
        return NULL;
    }
    Node *node = list->head;
    char *buffer = malloc(50000);
    strcpy(buffer, "[");
    while (node != NULL) {
        const Track *tr = (const Track*)node->data;
        char *buffer2 = trackToJSON(tr);
        strcat(buffer, buffer2);
        free(buffer2);
        if (node->next != NULL) {
            strcat(buffer, ",");
        }
        node = node->next;
    }
    strcat(buffer, "]");
    return buffer;
}

char* GPXtoJSON(const GPXdoc* gpx) {
    if (gpx == NULL) {
        return NULL;
    }
    char *buffer = malloc(1000);
    sprintf(buffer, "{%cversion%c:%.1f,%ccreator%c:%c%s%c,%cnumWaypoints%c:%d,%cnumRoutes%c:%d,%cnumTracks%c:%d}", '"', '"', gpx->version, '"', '"', '"', gpx->creator, '"', '"', '"', getLength(gpx->waypoints), '"', '"', getLength(gpx->routes), '"', '"', getLength(gpx->tracks));
    return buffer;
}
void addWaypoint(Route *rt, Waypoint *pt) {
    if (rt == NULL || pt == NULL) {
        return;
    }
    insertBack(rt->waypoints, pt);
    return;
}
void addRoute(GPXdoc* doc, Route* rt) {
    if (doc == NULL || rt == NULL) {
        return;
    }
    insertBack(doc->routes, rt);
    return;
}
GPXdoc* JSONtoGPX(const char* gpxString) {
    if (gpxString == NULL) {
        return NULL;
    }
    GPXdoc* doc = malloc(sizeof(GPXdoc));
    doc->waypoints = initializeList(waypointToString, dummyRouteDelete, compareWaypoints);
    doc->routes = initializeList(routeToString, dummyRouteDelete, compareRoutes);
    doc->tracks = initializeList(trackToString, dummyRouteDelete, compareTracks);
    int i;
    int j;
    int commaIndex = 0;
    int secondColon = 0;
    int firstColon = 0;
    int flag = 0;
    for (i = 0; i < strlen(gpxString); i++) {
        if (gpxString[i] == ',') {
            commaIndex = i;
        }
        if (gpxString[i] == ':' && flag == 0) {
            firstColon = i;
            flag = 1;
            
        }
        if (gpxString[i] == ':' && flag == 1) {
            secondColon = i;
        }
    }
    char *string1 = malloc(256);
    char *string2 = malloc(256);
    i = 0;
    for (j = firstColon + 1; j < commaIndex; j++) {
        string1[i] = gpxString[j];
        i++;
    }
    string1[i] = '\0';
    i = 0;
    for (j = secondColon + 2; j < strlen(gpxString) - 2; j++) {
        string2[i] = gpxString[j];
        i++;
    }
    string2[i] = '\0';
    doc->version = atof(string1);
    doc->creator = malloc(256);
    strcpy(doc->namespace, "http://www.topografix.com/GPX/1/1");
    strcpy(doc->creator, string2);
    free(string1);
    free(string2);
    return doc;
}


Waypoint* JSONtoWaypoint(const char* gpxString) {
    Waypoint * wpt = malloc(sizeof(Waypoint));
    wpt->otherData = initializeList(gpxDataToString, dummyRouteDelete, compareGpxData);
    wpt->name = malloc(256);
    
    if (gpxString == NULL) {
        return NULL;
    }
    int i;
    int j;
    int commaIndex = 0;
    int secondColon = 0;
    int firstColon = 0;
    int flag = 0;
    for (i = 0; i < strlen(gpxString); i++) {
        if (gpxString[i] == ',') {
            commaIndex = i;
        }
        if (gpxString[i] == ':' && flag == 0) {
            firstColon = i;
            flag = 1;
            
        }
        if (gpxString[i] == ':' && flag == 1) {
            secondColon = i;
        }
    }
    char *string1 = malloc(256);
    char *string2 = malloc(256);
    i = 0;
    for (j = firstColon + 1; j < commaIndex; j++) {
        string1[i] = gpxString[j];
        i++;
    }
    string1[i] = '\0';
    i = 0;
    for (j = secondColon + 1; j < strlen(gpxString) - 1; j++) {
        string2[i] = gpxString[j];
        i++;
    }
    string2[i] = '\0';
    strcpy(wpt->name, "");
    wpt->latitude = atof(string1);
    wpt->longitude = atof(string2);
    free(string1);
    free(string2);
    return wpt;
}
Route* JSONtoRoute(const char* gpxString) {
    Route * rt = malloc(sizeof(Route));
    rt->waypoints = initializeList(waypointToString, dummyRouteDelete, compareWaypoints);
    rt->otherData = initializeList(gpxDataToString, dummyRouteDelete, compareGpxData);
    if (gpxString == NULL) {
        return NULL;
    }
    int i;
    int j;
    int firstColon = 0;
    for (i = 0; i < strlen(gpxString); i++) {
        if (gpxString[i] == ':') {
            firstColon = i;
        }
    }
    char *string1 = malloc(256);
    i = 0;
    for (j = firstColon + 2; j < strlen(gpxString) - 2; j++) {
        string1[i] = gpxString[j];
        i++;
    }
    string1[i] = '\0';
    rt->name = malloc(256);
    strcpy(rt->name, string1);
    free(string1);
    return rt;
}

char * getGPXJSON(char *theFilename) {
    GPXdoc *doc = createValidGPXdoc(theFilename, "./parser/gpx.xsd");
    char *filename;
    if (doc != NULL) {
        filename = GPXtoJSON(doc);
    } else {
        return("err");
    }
    deleteGPXdoc(doc);
    return filename;
}
char* CompRouteToJSON(int count, const Route *rt) {
    char *buffer = malloc(50000);
    if (rt == NULL || rt->waypoints == NULL) {
        strcpy(buffer, "{}");
        return buffer;
    }
    char *name = malloc(100);
    if (strcmp(rt->name, "") == 0) {
        strcpy(name,"None");
    } else {
        strcpy(name, rt->name);
    }
    int totalPoints = 0;
    Node *node = rt->waypoints->head;
    printf("pls\n");
    while (node != NULL) {
        totalPoints++;
        node = node->next;
    }
    sprintf(buffer, "{\"count\":\"Route %d\",%cname%c:%c%s%c,%cnumPoints%c:%d,%clen%c:%.1f,%cloop%c:%s}", count, '"', '"', '"', name, '"', '"', '"',totalPoints, '"', '"', round10(getRouteLen(rt)), '"', '"', isLoopRoute(rt,15) ? "true" : "false");
    free(name);
    return buffer;
}
char* CompTrackToJSON(int count, const Track *tr) {
    char *buffer = malloc(50000);
    if (tr == NULL || tr->segments == NULL) {
        strcpy(buffer, "{}");
        return buffer;
    }
    char *name = malloc(100);
    if (strcmp(tr->name, "") == 0) {
        strcpy(name, "None");
    } else {
        strcpy(name, tr->name);
    }
    int totalPoints = 0;
    Node *node = tr->segments->head;
    while (node != NULL) {
        TrackSegment *temp = node->data;
        totalPoints += getLength(temp->waypoints);
        node = node->next;
    }
    
    sprintf(buffer, "{\"count\":\"Track %d\",%cname%c:%c%s%c,\"numPoints\":%d,%clen%c:%.1f,%cloop%c:%s}", count, '"', '"', '"', name, '"', totalPoints, '"', '"', round10(getTrackLen(tr)), '"', '"', isLoopTrack(tr,15) ? "true" : "false");
    free(name);
    return buffer;
}
char * fileDataToJSON(char *file) {
    char *totalArray = malloc(500000);
    GPXdoc * doc = createGPXdoc(file);
    int countRoutes = 0;
    int countTracks = 0;
    strcpy(totalArray, "[");
    if (doc->routes != NULL) {
        Node *routeNode = doc->routes->head;
        while (routeNode != NULL) {
            countRoutes++;
            Route *rt = (Route*)routeNode->data;
            char *temp = malloc(5000);
            strcpy(temp, "");
            strcpy(temp, CompRouteToJSON(countRoutes, rt));
            strcat(totalArray, temp);
            if (routeNode->next != NULL) {
                strcat(totalArray, ",");
            }
            routeNode = routeNode->next;
        }
    }
    if (getLength(doc->tracks) == 0) {
        strcat(totalArray, "]");
        return totalArray;
    } else {
        if(strcmp(totalArray, "[") != 0) {
            strcat(totalArray, ",");
        }
    }
    if (doc->tracks != NULL) {
        Node *trackNode = doc->tracks->head;
        while (trackNode != NULL) {
            countTracks++;
            const Track *trk = (Track*)trackNode->data;
            char *temp = malloc(5000);
            strcpy(temp, CompTrackToJSON(countTracks, trk));
            strcat(totalArray, temp);
            if (trackNode->next != NULL) {
                strcat(totalArray, ",");
            }
            
            trackNode = trackNode->next;
        }
    }
    strcat(totalArray, "]");
    return totalArray;
}
char* CompRouteToJSON2(int count, const Route *rt) {
    char *buffer = malloc(50000);
    if (rt == NULL || rt->waypoints == NULL) {
        strcpy(buffer, "{}");
        return buffer;
    }
    char *name = malloc(100);
    if (strcmp(rt->name, "") == 0) {
        strcpy(name,"None");
    } else {
        strcpy(name, rt->name);
    }
    int totalPoints = 0;
    Node *node = rt->waypoints->head;
    printf("pls\n");
    while (node != NULL) {
        totalPoints++;
        node = node->next;
    }
    sprintf(buffer, "{\"count\":%d,%cname%c:%c%s%c,%cnumPoints%c:%d,%clen%c:%.1f,%cloop%c:%s}", count, '"', '"', '"', name, '"', '"', '"',totalPoints, '"', '"', round10(getRouteLen(rt)), '"', '"', isLoopRoute(rt,15) ? "true" : "false");
    free(name);
    return buffer;
}
char *fileRouteToJSON(char *file) {
    char *totalArray = malloc(500000);
    GPXdoc *doc = createValidGPXdoc(file, "./parser/gpx.xsd");
    if (doc != NULL) {
        int countRoutes = 0;
        strcpy(totalArray, "[");
        if (doc->routes != NULL) {
            Node *routeNode = doc->routes->head;
            while (routeNode != NULL) {
                countRoutes++;
                Route *rt = (Route*)routeNode->data;
                char *temp = malloc(5000);
                strcpy(temp, "");
                strcpy(temp, CompRouteToJSON2(countRoutes, rt));
                strcat(totalArray, temp);
                if (routeNode->next != NULL) {
                    strcat(totalArray, ",");
                }
                routeNode = routeNode->next;
            }
        }
        strcat(totalArray, "]");
        return totalArray;
    } else {
        return("err");
    }
    //GPXdoc * doc = createGPXdoc(file);
}
char *otherDatatoJson1(GPXData *data) {
    char *buffer = malloc(5000);
    char *newval = malloc(2566);
    newval = strtok(data->value, "\t\n");
    sprintf(buffer, "{\"name\":\"%s\",\"value\":\"%s\"}", data->name, newval);
    return buffer;
}
char * createNewGPXFile(char *fileName) {
    GPXdoc *doc = JSONtoGPX("{\"version\":1.1,\"creator\":\"MEGHGPX\"}");
    writeGPXdoc(doc, fileName);
    return fileName;
}
char *otherDataToJSON(char *json, char *filename) {
    GPXdoc *doc = createGPXdoc(filename);
    char *trackorroute = malloc(256);
    int num = 0;
    char *arr = malloc(200000);
    sscanf(json,"%s %d", trackorroute, &num);
    strcpy(arr, "");
    if (strstr(trackorroute, "Route") != NULL && doc->routes != NULL) {
        Node *node = doc->routes->head;
        int counter = 0;
        while (node != NULL) {
            Route *rt = (Route*)node->data;
            counter++;
            if (counter == num) {
                if (rt->otherData != NULL) {
                    strcat(arr, "[");
                    Node *node2 = rt->otherData->head;
                    while (node2 != NULL) {
                        GPXData * data = (GPXData*)node2->data;
                        strcat(arr, otherDatatoJson1(data));
                        if (node->next != NULL) {
                            strcat(arr, ",");
                        }
                        node2 = node2->next;
                    }
                    
                }
                strcat(arr, "]");
            }
            node = node->next;
        } 
    } else if(strstr(trackorroute, "Track") != NULL && doc->tracks != NULL) {
        Node *node = doc->tracks->head;
        int counter = 0;
        while (node != NULL) {
            Track *trk = (Track*)node->data;
            counter++;
            if (counter == num) {
                strcat(arr, "[");
                if (trk->otherData != NULL) {
                    Node *node2 = trk->otherData->head;
                    while (node2 != NULL) {
                        GPXData * data = (GPXData*)node2->data;
                        strcat(arr, otherDatatoJson1(data));
                        if (node->next != NULL) {
                            strcat(arr, ",");
                        }
                        node2 = node2->next;
                    }
                    strcat(arr, "]");
                } 
            }
            node = node->next;
        }
    }
    return arr;
}

char * changeRouteName(char *filename, char *newName, char *oldName, char *comp) {
    GPXdoc * doc = createGPXdoc(filename);
    if (strstr(comp, "Route") != NULL) {
        Node *node = doc->routes->head;
        while (node != NULL) {
            Route *rt = (Route*)node->data;
            if (strcmp(rt->name, oldName) == 0) {
                strcpy(rt->name, newName);
            }
            node = node->next;
        }
    } else if (strstr(comp, "Track") != NULL) {
        Node *node = doc->tracks->head;
        while (node != NULL) {
            Track *trk = (Track*)node->data;
            if (strcmp(trk->name, oldName) == 0) {
                strcpy(trk->name, newName);
            }
            node = node->next;
        }
    } 
    remove(filename);
    writeGPXdoc(doc, filename);
    return filename;
}

char * addRouteWithWaypoints(char *filename, char *routename, char *jsonstring, int length) {
    GPXdoc *doc = createGPXdoc(filename);
    int newLength = length;
    Route * newRoute = malloc(sizeof(Route));
    newRoute->name = malloc(256);
    char newjson[100000];
    int i = 0;
    for (i = 0; i < strlen(jsonstring); i++) {
        newjson[i] = jsonstring[i];
    }
    newRoute->name = routename;
    
    newRoute->waypoints = initializeList(waypointToString, deleteWaypoint, compareWaypoints);
    newRoute->otherData = initializeList(gpxDataToString, deleteGpxData, compareGpxData);
    char *tok = malloc(1000);
    tok = strtok(newjson, "|");
    char *jsonarr[length];
    
    i = 0;
    while (tok != NULL)
    {
        jsonarr[i++] = tok;
        tok = strtok (NULL, "|");
    }
    i = 0;
    while (i < newLength) {
        Waypoint *wpt = JSONtoWaypoint(jsonarr[i]);
        addWaypoint(newRoute, wpt);
        i++;
    }

    addRoute(doc, newRoute);
    remove(filename);
    writeGPXdoc(doc, filename);
    return "nothing";
}

char * getPointsBetween(char *filename, float startLat, float startLon, float endLat, float endLon, float delta) {
    GPXdoc *doc = createGPXdoc(filename);
    char *totalArray = malloc(500000);
    int countRoutes = 0;
    int countTracks = 0;
    List *routes = getRoutesBetween(doc, startLat, startLon, endLat, endLon, delta);
    List *tracks = getTracksBetween(doc, startLat, startLon, endLat, endLon, delta);
    strcpy(totalArray, "");
    printf("broskiii\n");
    if (routes != NULL) {
        Node *routeNode = routes->head;
        while (routeNode != NULL) {
            countRoutes++;
            Route *rt = (Route*)routeNode->data;
            char *temp = malloc(5000);
            strcpy(temp, "");
            strcpy(temp, CompRouteToJSON(countRoutes, rt));
            strcat(totalArray, temp);
            strcat(totalArray, ",");
            routeNode = routeNode->next;
        }
    }
    printf("broskiii1\n");
    /*if (tracks != NULL) {
        if (getLength(tracks) == 0) {
            strcat(totalArray, "]");
            return totalArray;
        } 
    }*/
    
    printf("broskiii2\n");
    if (tracks != NULL) {
        Node *trackNode = tracks->head;
        while (trackNode != NULL) {
            countTracks++;
            Track *trk = (Track*)trackNode->data;
            char *temp = malloc(5000);
            strcpy(temp, CompTrackToJSON(countTracks, trk));
            strcat(totalArray, temp);
            strcat(totalArray, ",");
            trackNode = trackNode->next;
        }
    }
    
    printf("broskiii3\n");
    return totalArray;
}

char *waypointsToJson(Waypoint *wpt, int index) {
    char *buffer = malloc(50000);
    if (wpt == NULL) {
        strcpy(buffer, "{}");
        return buffer;
    }
    char *name = malloc(100);
    if (strcmp(wpt->name, "") == 0) {
        strcpy(name,"NULL");
    } else {
        strcpy(name, wpt->name);
    }
    sprintf(buffer, "{%cname%c:%c%s%c,%cindex%c:%d,%clatitude%c:%.07f,%clongitude%c:%0.7f}", '"', '"', '"', name, '"', '"', '"',index, '"', '"', wpt->latitude, '"', '"', wpt->longitude);
    free(name);
    return buffer;
}
char *waypointListToJSON(char *filename, char *routeName) {
    char *totalArray = malloc(200000);
    GPXdoc *doc = createValidGPXdoc(filename, "./parser/gpx.xsd");
    if (doc != NULL) {
        int countwpts = 0;
        strcpy(totalArray, "[");
        if (doc->routes != NULL) {
            Node *routeNode = doc->routes->head;
            while (routeNode != NULL) {
                Route *rt = (Route*)routeNode->data;
                if (strcmp(rt->name, routeName) == 0) {
                    Node *wptNode = rt->waypoints->head;
                    while (wptNode != NULL) {
                        countwpts++;
                        Waypoint *wpt = (Waypoint*)wptNode->data;
                        char *temp = malloc(5000);
                        strcpy(temp, "");
                        strcpy(temp, waypointsToJson(wpt, countwpts));
                        strcat(totalArray, temp);
                        if (wptNode->next != NULL) {
                            strcat(totalArray, ",");
                        }
                        wptNode = wptNode->next;
                    }
                }
                routeNode = routeNode->next;
            }
        }
        strcat(totalArray, "]");
        return totalArray;
    } else {
        return("err");
    }
}



GPXdoc* createGPXdoc(char* fileName) {
    if (fileName == NULL || strcmp(fileName, "") == 0) {
        return NULL;
    }
    GPXdoc *structDocs;
    xmlDoc * doc = xmlReadFile(fileName, NULL, 0);
    if (doc != NULL) {
        structDocs = malloc(sizeof(GPXdoc));
    } else {
        xmlFreeDoc(doc);
        xmlCleanupParser();
        printf("There is no valid file found");
        return NULL;
    }
    xmlNode *root_element = NULL;
    xmlNode *currentNode = NULL;
    root_element = xmlDocGetRootElement(doc);
    xmlAttr *attr;
    
    for (currentNode = root_element; currentNode != NULL; currentNode = currentNode->next) {
        for (attr = currentNode->properties; attr != NULL; attr = attr->next) {
            xmlNode *value = attr->children;
            char *cont = (char *)(value->content);
            if (strcmp((char*)attr->name, "version") == 0) {
                structDocs->version = atof(cont);
            } else if (strcmp((char*)attr->name, "creator") == 0) {
                structDocs->creator = malloc(strlen(cont) + 5);
                strcpy(structDocs->creator, cont);
            } 
        }
    }
    strcpy(structDocs->namespace, (char*)root_element->ns->href);
    //fflush(stdout);
    void (*foo) (void* delete);
    foo = &deleteWaypoint;
    char* (*bar) (void* print);
    bar = &waypointToString;
    int (*baz) (const void* firstComp, const void* secondComp);
    baz = &compareWaypoints;

    void (*fooRoute) (void* delete);
    fooRoute = &deleteRoute;
    char* (*barRoute) (void* print);
    barRoute = &routeToString;
    int (*bazRoute) (const void* firstComp, const void* secondComp);
    bazRoute = &compareRoutes;

    void (*fooTrack) (void* delete);
    fooTrack = &deleteTrack;
    char* (*barTrack) (void* print);
    barTrack = &trackToString;
    int (*bazTrack) (const void* firstComp, const void* secondComp);
    bazTrack = &compareTracks;

    void (*fooTrackSeg) (void* delete);
    fooTrackSeg = &deleteTrackSegment;
    char* (*barTrackSeg) (void* print);
    barTrackSeg = &trackSegmentToString;
    int (*bazTrackSeg) (const void* firstComp, const void* secondComp);
    bazTrackSeg = &compareTrackSegments;

    void (*fooGpxData) (void* delete);
    fooGpxData = &deleteGpxData;
    char* (*barGpxData) (void* print);
    barGpxData = &gpxDataToString;
    int (*bazGpxData) (const void* firstComp, const void* secondComp);
    bazGpxData = &compareGpxData;

    List *waypoints = initializeList(bar, foo, baz);
    List *routes = initializeList(barRoute, fooRoute, bazRoute);
    List *tracks = initializeList(barTrack, fooTrack, bazTrack);
    
    
    xmlAttr *attr3;
    xmlNode *childrenNode = root_element->children;

    for (currentNode = childrenNode; currentNode != NULL; currentNode = currentNode->next) {
        // /char *theName = (char*)currentNode->children->name;
        if (strcmp((char*)(currentNode->name), "wpt") == 0) {
            Waypoint *wObj = malloc(sizeof(Waypoint));
            wObj->otherData = initializeList(barGpxData, fooGpxData, bazGpxData);
            wObj->name = malloc(1);

            strcpy(wObj->name, "");
            for (attr3 = currentNode->properties; attr3 != NULL; attr3 = attr3->next) {
                xmlNode *value = attr3->children;
                char *nameAttr = (char*) attr3->name;
                char *cont = (char *)(value->content);
                if (strcmp(nameAttr, "lat") == 0) {
                    wObj->latitude = atof(cont);
                } else if (strcmp(nameAttr, "lon") == 0) {
                    wObj->longitude = atof(cont);
                } 
                  
            }
            for (xmlNode *n = currentNode->children; n != NULL; n = n->next) {
                char * theName = (char*)(n->name);
                if (strcmp(theName, "name") == 0) {
                    free(wObj->name);
                    wObj->name = malloc(strlen((char*)n->children->name) + 25);
                    strcpy(wObj->name, (char*)n->children->content);
                } else if (strcmp(theName, "text") != 0) {
                    char* description = (char*)n->children->content;
                    GPXData *d = malloc(sizeof(GPXData) + strlen(description) + 10);
                    strcpy(d->name, theName);
                    strcpy(d->value, description);
                    insertBack(wObj->otherData, d);
                }
            }
            insertBack(waypoints, wObj);
        } else if(strcmp((char*)(currentNode->name), "rte") == 0) {
            Route * rt = malloc(sizeof(Route));
            rt->waypoints = initializeList(bar, foo, baz);
            rt->otherData = initializeList(barGpxData, fooGpxData, bazGpxData);
            rt->name = malloc(1);
            strcpy(rt->name, "");
            for (xmlNode *n = currentNode->children; n != NULL; n = n->next) {
                char * theName = (char*)(n->name);
                if (strcmp(theName, "name") == 0) {
                    free(rt->name);
                    rt->name = malloc(strlen((char*)n->children->content) + 10);
                    strcpy(rt->name, (char*)n->children->content);
                } else if (strcmp(theName, "rtept") == 0) {
                    Waypoint *wObjRoute = malloc(sizeof(Waypoint));
                    wObjRoute->otherData = initializeList(barGpxData, fooGpxData, bazGpxData);
                    wObjRoute->name = malloc(1);
                    strcpy(wObjRoute->name, "");
                    for (xmlAttr *attribute = n->properties; attribute != NULL; attribute = attribute->next) {
                        xmlNode *value = attribute->children;
                        char *nameAttr = (char*) attribute->name;
                        char *cont = (char *)(value->content);
                        if (strcmp(nameAttr, "lat") == 0) {
                            wObjRoute->latitude = atof(cont);
                        } else if (strcmp(nameAttr, "lon") == 0) {
                            wObjRoute->longitude = atof(cont);
                        } 
                    }
                    for (xmlNode *node = n->children; node != NULL; node = node->next) {
                        char * theName = (char*)(node->name);
                        if (strcmp(theName, "name") == 0) {
                            free(wObjRoute->name);
                            wObjRoute->name = malloc(strlen((char*)node->children->name) + 10);
                            strcpy(wObjRoute->name, (char*)node->children->content);
                        } else if (strcmp(theName, "text") != 0) {
                            char* description = (char*)node->children->content;
                            GPXData *d = malloc(sizeof(GPXData) + strlen(description) + 10);
                            strcpy(d->name, theName);
                            strcpy(d->value, description);
                            insertBack(wObjRoute->otherData, d);
                        }
                    }
                    insertBack(rt->waypoints, wObjRoute);
                } else if (strcmp(theName, "text") != 0) {
                    char* description = (char*)n->children->content;
                    GPXData *d = malloc(sizeof(GPXData) + strlen(description) + 10);
                    strcpy(d->name, theName);
                    strcpy(d->value, description);
                    insertBack(rt->otherData, d);
                }
            }

            insertBack(routes, rt);
        } else if (strcmp((char*)currentNode->name, "trk") == 0) {
            Track * track = malloc(sizeof(Track));
            track->segments = initializeList(barTrackSeg, fooTrackSeg, bazTrackSeg);
            track->otherData = initializeList(barGpxData, fooGpxData, bazGpxData);
            track->name = malloc(1);
            strcpy(track->name, "");
            for (xmlNode *n = currentNode->children; n != NULL; n = n->next) {
                char * theName = (char*)(n->name);
                if (strcmp(theName, "name") == 0) {
                    free(track->name);
                    track->name = malloc(strlen((char*)n->children->name)+40);
                    strcpy(track->name, (char*)n->children->content);
                }
                else if (strcmp(theName, "trkseg") == 0) {
                    TrackSegment *trackSegments = malloc(sizeof(TrackSegment));
                    trackSegments->waypoints = initializeList(bar, foo, baz);
                    for (xmlNode *nNode = n->children; nNode != NULL; nNode = nNode->next) {
                        if (strcmp((char*)nNode->name, "trkpt") == 0) {
                            Waypoint *trackSegWayPoint = malloc(sizeof(Waypoint));
                            trackSegWayPoint->name = malloc(1);
                            strcpy(trackSegWayPoint->name, "");
                            trackSegWayPoint->otherData = initializeList(barGpxData, fooGpxData, bazGpxData);
                            for (xmlAttr *attribute = nNode->properties; attribute != NULL; attribute = attribute->next) {
                                xmlNode *value = attribute->children;
                                char *nameAttr = (char*) attribute->name;
                                char *cont = (char *)(value->content);
                                if (strcmp(nameAttr, "lat") == 0) {
                                    trackSegWayPoint->latitude = atof(cont);
                                } else if (strcmp(nameAttr, "lon") == 0) {
                                    trackSegWayPoint->longitude = atof(cont);
                                } 
                            } 
                            for (xmlNode *node = nNode->children; node != NULL; node = node->next) {
                                char * theName = (char*)(node->name);
                                if (strcmp(theName, "name") == 0) {
                                    free(trackSegWayPoint->name);
                                    trackSegWayPoint->name = malloc(strlen((char*)node->children->name)+10);
                                    strcpy(trackSegWayPoint->name, (char*)node->children->content);
                                } else if (strcmp(theName, "text") != 0) {
                                    char* description = (char*)node->children->content;
                                    GPXData *d = malloc(sizeof(GPXData) + strlen(description) + 10);
                                    strcpy(d->name, theName);
                                    strcpy(d->value, description);
                                    if (strcmp(d->name, "") != 0 && strcmp(d->value, "") != 0) {
                                        insertBack(trackSegWayPoint->otherData, d);
                                    }
                                }
                            } 
                            insertBack(trackSegments->waypoints, trackSegWayPoint); 
                        }
                    }
                    insertBack(track->segments, trackSegments);
                } else if (strcmp(theName, "text") != 0) {
                    char* description = (char*)n->children->content;
                    GPXData *d = malloc(sizeof(GPXData) + strlen(description) + 10);
                    
                    strcpy(d->name, theName);
                    strcpy(d->value, description);
                    if (strcmp(d->name, "") != 0 && strcmp(d->value, "") != 0) {
                        insertBack(track->otherData, d);
                    }
                }
            }
            insertBack(tracks, track);
        }
    }    
    structDocs->waypoints = waypoints;
    structDocs->tracks = tracks;
    structDocs->routes = routes;
    xmlFreeDoc(doc);
    //xmlCleanupParser();
    printf("doc returned succesfully\n");
    return structDocs;
}

char* GPXdocToString(GPXdoc* doc) {
    char *wp = toString(doc->waypoints);
    char *route = toString(doc->routes);
    char *track = toString(doc->tracks);
    printf("%s\n", wp);
    printf("%s\n", route);
    printf("%s\n", track);
    printf("The creator is %s\n",doc->creator);
    printf("The namespace is: %s\n",doc->namespace);
    free(wp);
    free(route);
    free(track);
    return NULL;
}

void deleteGPXdoc(GPXdoc* doc) {
    if (doc == NULL) {
        return;
    } else {
        GPXdoc *temp = (GPXdoc*) doc;
        xmlCleanupParser();
        free(temp->creator);
        freeList(temp->tracks);
        freeList(temp->routes);
        freeList(temp->waypoints);
        free(temp);
    }
}






















































